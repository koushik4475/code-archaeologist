import { GitAnalyzer } from '../git/gitAnalyzer.js';
import simpleGit from 'simple-git';

export async function analyzeRepo(options = {}) {
  const { since, topN = 10 } = options;
  const git = new GitAnalyzer();
  const simpleGitInstance = simpleGit();

  // Get repository stats
  const logOptions = {};
  if (since) {
    logOptions['--since'] = since;
  }

  const log = await simpleGitInstance.log(logOptions);
  
  // Analyze commit patterns
  const commitsByAuthor = new Map();
  const commitsByFile = new Map();
  const commitsByMonth = new Map();
  const urgentCommits = [];

  for (const commit of log.all) {
    // Author stats
    commitsByAuthor.set(
      commit.author_name,
      (commitsByAuthor.get(commit.author_name) || 0) + 1
    );

    // Month stats
    const month = commit.date.substring(0, 7); // YYYY-MM
    commitsByMonth.set(month, (commitsByMonth.get(month) || 0) + 1);

    // Check for urgent commits
    if (/fix|bug|hotfix|urgent|critical/i.test(commit.message)) {
      urgentCommits.push({
        hash: commit.hash.substring(0, 7),
        date: commit.date,
        author: commit.author_name,
        message: commit.message
      });
    }

    // Get files changed in this commit
    try {
      const diff = await simpleGitInstance.diff([
        `${commit.hash}~1`,
        commit.hash,
        '--name-only'
      ]);
      
      const files = diff.split('\n').filter(f => f);
      files.forEach(file => {
        commitsByFile.set(file, (commitsByFile.get(file) || 0) + 1);
      });
    } catch (error) {
      // Skip if can't get diff (e.g., first commit)
    }
  }

  // Sort and get top files by activity
  const topFiles = Array.from(commitsByFile.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([file, commits]) => ({ file, commits }));

  // Sort contributors
  const topContributors = Array.from(commitsByAuthor.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([author, commits]) => ({ author, commits }));

  // Calculate activity timeline
  const timeline = Array.from(commitsByMonth.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, commits]) => ({ month, commits }));

  // Calculate repository health metrics
  const healthMetrics = calculateRepoHealth(
    log.all,
    urgentCommits,
    topFiles,
    timeline
  );

  return {
    type: 'repository',
    summary: {
      totalCommits: log.all.length,
      uniqueAuthors: commitsByAuthor.size,
      dateRange: {
        from: log.all[log.all.length - 1]?.date || 'Unknown',
        to: log.all[0]?.date || 'Unknown'
      }
    },
    topFiles,
    topContributors,
    urgentCommits: urgentCommits.slice(0, 20),
    timeline: timeline.slice(-12), // Last 12 months
    healthMetrics,
    insights: generateRepoInsights(healthMetrics, urgentCommits, topFiles)
  };
}

function calculateRepoHealth(commits, urgentCommits, topFiles, timeline) {
  const metrics = {
    bugFixRatio: 0,
    changeConcentration: 0,
    activityTrend: 'stable',
    overallHealth: 'good'
  };

  // Bug fix ratio
  metrics.bugFixRatio = commits.length > 0 
    ? ((urgentCommits.length / commits.length) * 100).toFixed(1)
    : 0;

  // Change concentration (how much work is in top 10 files)
  const totalFileCommits = topFiles.reduce((sum, f) => sum + f.commits, 0);
  const allCommitsCount = commits.length;
  metrics.changeConcentration = allCommitsCount > 0
    ? ((totalFileCommits / allCommitsCount) * 100).toFixed(1)
    : 0;

  // Activity trend (comparing recent vs older commits)
  if (timeline.length >= 2) {
    const recentMonths = timeline.slice(-3);
    const olderMonths = timeline.slice(-6, -3);
    
    const recentAvg = recentMonths.reduce((s, m) => s + m.commits, 0) / recentMonths.length;
    const olderAvg = olderMonths.length > 0 
      ? olderMonths.reduce((s, m) => s + m.commits, 0) / olderMonths.length 
      : recentAvg;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 20) metrics.activityTrend = 'increasing';
    else if (change < -20) metrics.activityTrend = 'decreasing';
    else metrics.activityTrend = 'stable';
  }

  // Overall health score
  const healthScore = calculateHealthScore(metrics);
  if (healthScore > 70) metrics.overallHealth = 'good';
  else if (healthScore > 40) metrics.overallHealth = 'fair';
  else metrics.overallHealth = 'poor';

  metrics.healthScore = healthScore;

  return metrics;
}

function calculateHealthScore(metrics) {
  let score = 100;

  // Penalize high bug fix ratio
  const bugRatio = parseFloat(metrics.bugFixRatio);
  if (bugRatio > 30) score -= 30;
  else if (bugRatio > 20) score -= 20;
  else if (bugRatio > 10) score -= 10;

  // Penalize high change concentration (technical debt indicator)
  const concentration = parseFloat(metrics.changeConcentration);
  if (concentration > 50) score -= 20;
  else if (concentration > 30) score -= 10;

  // Penalize decreasing activity
  if (metrics.activityTrend === 'decreasing') score -= 15;

  return Math.max(0, score);
}

function generateRepoInsights(healthMetrics, urgentCommits, topFiles) {
  const insights = [];

  // Health assessment
  insights.push({
    type: 'health',
    severity: healthMetrics.overallHealth === 'poor' ? 'high' : 'info',
    message: `Repository health: ${healthMetrics.overallHealth} (score: ${healthMetrics.healthScore}/100)`
  });

  // Bug fix ratio
  const bugRatio = parseFloat(healthMetrics.bugFixRatio);
  if (bugRatio > 20) {
    insights.push({
      type: 'quality',
      severity: 'high',
      message: `High bug fix ratio (${bugRatio}%) - quality issues detected`
    });
  }

  // Change concentration
  const concentration = parseFloat(healthMetrics.changeConcentration);
  if (concentration > 40) {
    insights.push({
      type: 'hotspot',
      severity: 'medium',
      message: `${concentration}% of changes in top ${topFiles.length} files - potential hotspots`
    });
  }

  // Activity trend
  if (healthMetrics.activityTrend === 'decreasing') {
    insights.push({
      type: 'activity',
      severity: 'medium',
      message: 'Commit activity is decreasing - project may be in maintenance mode'
    });
  } else if (healthMetrics.activityTrend === 'increasing') {
    insights.push({
      type: 'activity',
      severity: 'info',
      message: 'Commit activity is increasing - active development detected'
    });
  }

  // Urgent commits pattern
  if (urgentCommits.length > 10) {
    insights.push({
      type: 'pattern',
      severity: 'high',
      message: `${urgentCommits.length} urgent/fix commits found - review development process`
    });
  }

  return insights;
}
