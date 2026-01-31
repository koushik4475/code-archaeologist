import chalk from 'chalk';
import { table } from 'table';

export function displayResults(results, jsonOutput = false) {
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  switch (results.type) {
    case 'file':
      displayFileResults(results);
      break;
    case 'function':
      displayFunctionResults(results);
      break;
    case 'dead_code_scan':
      displayDeadCodeResults(results);
      break;
    case 'repository':
      displayRepoResults(results);
      break;
    default:
      console.log(results);
  }
}

function displayFileResults(results) {
  console.log(chalk.bold.cyan(`\n📄 File Analysis: ${results.file}\n`));

  // Metadata
  console.log(chalk.bold('📊 Metadata'));
  console.log(`  Created: ${results.metadata.created?.date || 'Unknown'} by ${results.metadata.created?.author || 'Unknown'}`);
  console.log(`  Last Modified: ${results.metadata.lastModified?.date || 'Unknown'} (${results.metadata.lastModified?.daysAgo || 'N/A'} days ago)`);
  console.log(`  Total Commits: ${results.metadata.totalCommits}`);
  console.log(`  Unique Authors: ${results.metadata.uniqueAuthors}\n`);

  // Stats
  console.log(chalk.bold('📈 Statistics'));
  console.log(`  Lines Added: ${results.stats.totalAdded}`);
  console.log(`  Lines Removed: ${results.stats.totalRemoved}`);
  console.log(`  Avg Change Size: ${results.stats.avgChangeSize} lines`);
  console.log(`  Change Velocity: ${results.stats.changeVelocity} (${results.stats.velocityValue} commits/month)\n`);

  // AI Insights
  if (results.aiInsights?.summary) {
    console.log(chalk.bold.yellow('🤖 AI Analysis'));
    console.log(chalk.gray(formatText(results.aiInsights.summary)));
    console.log();
  }

  // Code Smells
  if (results.codeSmells && results.codeSmells.length > 0) {
    console.log(chalk.bold.red('⚠️  Code Smells Detected'));
    results.codeSmells.forEach(smell => {
      const icon = smell.severity === 'high' ? '🔴' : '🟡';
      console.log(`  ${icon} ${smell.type}: ${smell.message}`);
      if (smell.commits && smell.commits.length > 0) {
        smell.commits.slice(0, 2).forEach(c => {
          console.log(chalk.gray(`     • ${c.date} (${c.hash}): ${c.message.substring(0, 60)}`));
        });
      }
    });
    console.log();
  }

  // Recommendations
  if (results.recommendations && results.recommendations.length > 0) {
    console.log(chalk.bold.green('💡 Recommendations'));
    results.recommendations.forEach(rec => {
      const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🔵';
      console.log(`  ${icon} ${rec.type}: ${rec.message}`);
    });
    console.log();
  }

  // Recent History
  if (results.history && results.history.length > 0) {
    console.log(chalk.bold('📜 Recent Commit History'));
    const historyData = [
      ['Date', 'Author', 'Message', 'Changes']
    ];
    
    results.history.slice(0, 5).forEach(commit => {
      historyData.push([
        commit.date.substring(0, 10),
        commit.author.substring(0, 20),
        commit.message.substring(0, 40),
        `+${commit.changes?.added || 0}/-${commit.changes?.removed || 0}`
      ]);
    });

    console.log(table(historyData, {
      columns: {
        0: { width: 12 },
        1: { width: 20 },
        2: { width: 42 },
        3: { width: 12 }
      }
    }));
  }

  // Related Files
  if (results.relatedFiles && results.relatedFiles.length > 0) {
    console.log(chalk.bold('🔗 Frequently Changed Together'));
    results.relatedFiles.forEach(rf => {
      console.log(`  • ${rf.file} (${rf.commits} commits)`);
    });
    console.log();
  }
}

function displayFunctionResults(results) {
  console.log(chalk.bold.cyan(`\n⚡ Function Analysis: ${results.function.name}\n`));

  // Function Info
  console.log(chalk.bold('📍 Location'));
  console.log(`  File: ${results.file}`);
  console.log(`  Lines: ${results.function.lineRange} (${results.function.lineCount} lines)\n`);

  // Metrics
  console.log(chalk.bold('📊 Metrics'));
  console.log(`  Complexity: ${results.metrics.complexity.level} (${results.metrics.complexity.score})`);
  console.log(`  Contributors: ${results.metrics.contributors}`);
  console.log(`  Stability: ${results.metrics.stability}`);
  console.log(`  Last Modified: ${results.metrics.lastModified}\n`);

  // AI Analysis
  if (results.aiAnalysis) {
    console.log(chalk.bold.yellow('🤖 AI Analysis'));
    console.log(chalk.gray(formatText(results.aiAnalysis)));
    console.log();
  }

  // Recommendations
  if (results.recommendations && results.recommendations.length > 0) {
    console.log(chalk.bold.green('💡 Recommendations'));
    results.recommendations.forEach(rec => {
      const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🔵';
      console.log(`  ${icon} ${rec.type}: ${rec.message}`);
    });
    console.log();
  }

  // Related Commits
  if (results.relatedCommits && results.relatedCommits.length > 0) {
    console.log(chalk.bold('📜 Related Commits'));
    results.relatedCommits.slice(0, 5).forEach(commit => {
      console.log(`  • ${commit.date.substring(0, 10)} (${commit.hash}): ${commit.message.substring(0, 60)}`);
    });
    console.log();
  }
}

function displayDeadCodeResults(results) {
  console.log(chalk.bold.cyan(`\n🪦 Dead Code Scan: ${results.directory}\n`));

  // Summary
  console.log(chalk.bold('📊 Summary'));
  console.log(`  Total Files Scanned: ${results.totalFiles}`);
  console.log(`  Dead Code Files: ${chalk.red(results.deadCode.length)}`);
  console.log(`  Suspicious Files: ${chalk.yellow(results.suspicious.length)}`);
  console.log(`  Active Files: ${chalk.green(results.active.length)}\n`);

  // Insights
  if (results.insights && results.insights.length > 0) {
    console.log(chalk.bold.yellow('💡 Insights'));
    results.insights.forEach(insight => {
      console.log(`  • ${insight.message}`);
    });
    console.log();
  }

  // Dead Code Files
  if (results.deadCode.length > 0) {
    console.log(chalk.bold.red('🔴 Dead Code Files (Top 10)'));
    const deadData = [
      ['File', 'Last Modified', 'Days Ago', 'Author']
    ];
    
    results.deadCode.slice(0, 10).forEach(file => {
      deadData.push([
        file.path.substring(0, 40),
        file.lastModified.substring(0, 10),
        file.daysAgo.toString(),
        file.author.substring(0, 20)
      ]);
    });

    console.log(table(deadData, {
      columns: {
        0: { width: 42 },
        1: { width: 12 },
        2: { width: 10 },
        3: { width: 22 }
      }
    }));
  }

  // Suspicious Files
  if (results.suspicious.length > 0) {
    console.log(chalk.bold.yellow('🟡 Suspicious Files (Top 5)'));
    results.suspicious.slice(0, 5).forEach(file => {
      console.log(`  • ${file.path} (${file.daysAgo} days ago)`);
    });
    console.log();
  }
}

function displayRepoResults(results) {
  console.log(chalk.bold.cyan('\n🏛️  Repository Analysis\n'));

  // Summary
  console.log(chalk.bold('📊 Summary'));
  console.log(`  Total Commits: ${results.summary.totalCommits}`);
  console.log(`  Unique Contributors: ${results.summary.uniqueAuthors}`);
  console.log(`  Date Range: ${results.summary.dateRange.from.substring(0, 10)} to ${results.summary.dateRange.to.substring(0, 10)}\n`);

  // Health Metrics
  console.log(chalk.bold('🏥 Health Metrics'));
  const health = results.healthMetrics.overallHealth;
  const healthColor = health === 'good' ? 'green' : health === 'fair' ? 'yellow' : 'red';
  console.log(`  Overall Health: ${chalk[healthColor](health)} (${results.healthMetrics.healthScore}/100)`);
  console.log(`  Bug Fix Ratio: ${results.healthMetrics.bugFixRatio}%`);
  console.log(`  Change Concentration: ${results.healthMetrics.changeConcentration}%`);
  console.log(`  Activity Trend: ${results.healthMetrics.activityTrend}\n`);

  // Insights
  if (results.insights && results.insights.length > 0) {
    console.log(chalk.bold.yellow('💡 Insights'));
    results.insights.forEach(insight => {
      const icon = insight.severity === 'high' ? '🔴' : insight.severity === 'medium' ? '🟡' : 'ℹ️';
      console.log(`  ${icon} ${insight.message}`);
    });
    console.log();
  }

  // Top Files
  if (results.topFiles && results.topFiles.length > 0) {
    console.log(chalk.bold('🔥 Hotspot Files (Most Changed)'));
    const filesData = [
      ['File', 'Commits']
    ];
    
    results.topFiles.forEach(file => {
      filesData.push([
        file.file.substring(0, 60),
        file.commits.toString()
      ]);
    });

    console.log(table(filesData, {
      columns: {
        0: { width: 62 },
        1: { width: 10 }
      }
    }));
  }

  // Top Contributors
  if (results.topContributors && results.topContributors.length > 0) {
    console.log(chalk.bold('👥 Top Contributors'));
    results.topContributors.slice(0, 5).forEach(contributor => {
      const bar = '█'.repeat(Math.min(50, contributor.commits));
      console.log(`  ${contributor.author.padEnd(25)} ${chalk.cyan(bar)} ${contributor.commits}`);
    });
    console.log();
  }

  // Activity Timeline
  if (results.timeline && results.timeline.length > 0) {
    console.log(chalk.bold('📈 Activity Timeline (Last 12 Months)'));
    results.timeline.forEach(month => {
      const bar = '▓'.repeat(Math.min(50, Math.ceil(month.commits / 2)));
      console.log(`  ${month.month}  ${chalk.green(bar)} ${month.commits}`);
    });
    console.log();
  }
}

function formatText(text, maxWidth = 80) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length > maxWidth) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return '  ' + lines.join('\n  ');
}
