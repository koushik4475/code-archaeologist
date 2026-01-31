import { GitAnalyzer } from '../git/gitAnalyzer.js';
import { AIAnalyzer } from '../ai/aiAnalyzer.js';
import { existsSync } from 'fs';
import { resolve } from 'path';

export async function analyzeFile(filepath, options = {}) {
  const absolutePath = resolve(filepath);
  
  if (!existsSync(absolutePath)) {
    throw new Error(`File not found: ${filepath}`);
  }

  const git = new GitAnalyzer();
  const ai = new AIAnalyzer();

  // Check if file is in git
  const inGit = await git.fileExistsInGit(filepath);
  if (!inGit) {
    throw new Error(`File is not tracked by git: ${filepath}`);
  }

  // Gather git data
  const [history, created, lastModified, relatedFiles, urgentCommits] = await Promise.all([
    git.getFileHistory(filepath, { depth: options.depth || 10, includeStats: true }),
    git.getFileCreationInfo(filepath),
    git.getLastModification(filepath),
    git.getRelatedFiles(filepath),
    git.searchCommits(filepath)
  ]);

  // Calculate statistics
  const stats = calculateStats(history);

  // Get AI insights
  const metadata = { created, lastModified };
  const aiInsights = await ai.analyzeFileHistory(filepath, history, metadata);
  const codeSmells = await ai.detectCodeSmells(urgentCommits);

  // Compile results
  return {
    file: filepath,
    type: 'file',
    metadata: {
      created,
      lastModified,
      totalCommits: history.length,
      uniqueAuthors: new Set(history.map(h => h.author)).size
    },
    stats,
    history: history.slice(0, 10), // Top 10 commits
    relatedFiles,
    urgentCommits: urgentCommits.slice(0, 5),
    aiInsights,
    codeSmells,
    recommendations: generateRecommendations(stats, codeSmells, metadata)
  };
}

function calculateStats(history) {
  if (history.length === 0) {
    return { totalAdded: 0, totalRemoved: 0, avgChangeSize: 0, changeVelocity: 'low' };
  }

  const totalAdded = history.reduce((sum, h) => sum + (h.changes?.added || 0), 0);
  const totalRemoved = history.reduce((sum, h) => sum + (h.changes?.removed || 0), 0);
  const avgChangeSize = Math.round((totalAdded + totalRemoved) / history.length);

  // Calculate change velocity (commits per month)
  const firstDate = new Date(history[history.length - 1].date);
  const lastDate = new Date(history[0].date);
  const monthsDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30);
  const velocity = monthsDiff > 0 ? history.length / monthsDiff : 0;

  let changeVelocity = 'low';
  if (velocity > 5) changeVelocity = 'high';
  else if (velocity > 2) changeVelocity = 'medium';

  return {
    totalAdded,
    totalRemoved,
    avgChangeSize,
    changeVelocity,
    velocityValue: velocity.toFixed(2)
  };
}

function generateRecommendations(stats, codeSmells, metadata) {
  const recommendations = [];

  // Check for dead code
  const daysSinceModification = metadata.lastModified?.daysAgo || 0;
  if (daysSinceModification > 365) {
    recommendations.push({
      type: 'potential_dead_code',
      priority: 'medium',
      message: `No changes in ${daysSinceModification} days - consider if this is still needed`
    });
  }

  // Check for high churn
  if (stats.changeVelocity === 'high') {
    recommendations.push({
      type: 'high_churn',
      priority: 'high',
      message: 'High change frequency detected - may indicate instability or unclear requirements'
    });
  }

  // Check code smells
  if (codeSmells.length > 0) {
    recommendations.push({
      type: 'technical_debt',
      priority: 'high',
      message: 'Technical debt detected - review and refactor recommended',
      details: codeSmells
    });
  }

  // No recent activity but not old
  const age = metadata.created?.daysAgo || 0;
  if (daysSinceModification > 180 && daysSinceModification < 365 && age < 730) {
    recommendations.push({
      type: 'maintenance_needed',
      priority: 'low',
      message: 'File is stable but not actively maintained - ensure it still meets requirements'
    });
  }

  return recommendations;
}
