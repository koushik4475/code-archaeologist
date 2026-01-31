import { GitAnalyzer } from '../git/gitAnalyzer.js';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

export async function detectDeadCode(directory, options = {}) {
  const { recursive = false, thresholdDays = 365 } = options;
  const git = new GitAnalyzer(directory);

  const files = await scanDirectory(directory, recursive);
  const results = {
    type: 'dead_code_scan',
    directory,
    totalFiles: files.length,
    deadCode: [],
    suspicious: [],
    active: []
  };

  for (const file of files) {
    const lastMod = await git.getLastModification(file);
    
    if (!lastMod) continue;

    const category = categorizeFile(lastMod.daysAgo, thresholdDays);
    
    const fileInfo = {
      path: file,
      lastModified: lastMod.date,
      daysAgo: lastMod.daysAgo,
      author: lastMod.author,
      lastCommit: lastMod.message
    };

    if (category === 'dead') {
      results.deadCode.push(fileInfo);
    } else if (category === 'suspicious') {
      results.suspicious.push(fileInfo);
    } else {
      results.active.push(fileInfo);
    }
  }

  // Sort by days ago (oldest first)
  results.deadCode.sort((a, b) => b.daysAgo - a.daysAgo);
  results.suspicious.sort((a, b) => b.daysAgo - a.daysAgo);

  // Generate insights
  results.insights = generateDeadCodeInsights(results, thresholdDays);

  return results;
}

async function scanDirectory(directory, recursive) {
  const files = [];
  const codeExtensions = [
    '.js', '.jsx', '.ts', '.tsx', 
    '.py', '.java', '.cpp', '.c', '.h',
    '.cs', '.go', '.rb', '.php', '.swift'
  ];

  function scan(dir, depth = 0) {
    if (!recursive && depth > 0) return;

    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        // Skip common non-source directories
        if ([
          'node_modules', '.git', 'dist', 'build', 
          'coverage', '.next', '__pycache__', 'vendor'
        ].includes(entry)) {
          continue;
        }

        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          scan(fullPath, depth + 1);
        } else if (stat.isFile()) {
          const ext = extname(entry);
          if (codeExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  scan(directory);
  return files;
}

function categorizeFile(daysAgo, threshold) {
  if (daysAgo > threshold) {
    return 'dead';
  } else if (daysAgo > threshold * 0.7) {
    return 'suspicious';
  } else {
    return 'active';
  }
}

function generateDeadCodeInsights(results, threshold) {
  const insights = [];

  const deadCount = results.deadCode.length;
  const totalCount = results.totalFiles;
  const deadPercentage = totalCount > 0 ? ((deadCount / totalCount) * 100).toFixed(1) : 0;

  if (deadCount > 0) {
    insights.push({
      type: 'summary',
      message: `Found ${deadCount} files (${deadPercentage}%) untouched for ${threshold}+ days`
    });
  }

  // Find oldest file
  if (results.deadCode.length > 0) {
    const oldest = results.deadCode[0];
    insights.push({
      type: 'oldest',
      message: `Oldest untouched file: ${oldest.path} (${oldest.daysAgo} days)`,
      file: oldest
    });
  }

  // Pattern detection
  const filesByExtension = new Map();
  results.deadCode.forEach(file => {
    const ext = extname(file.path);
    filesByExtension.set(ext, (filesByExtension.get(ext) || 0) + 1);
  });

  if (filesByExtension.size > 0) {
    const topExt = Array.from(filesByExtension.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    insights.push({
      type: 'pattern',
      message: `Most dead code in ${topExt[0]} files (${topExt[1]} files)`
    });
  }

  return insights;
}
