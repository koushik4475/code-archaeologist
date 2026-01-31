import { GitAnalyzer } from '../git/gitAnalyzer.js';
import { AIAnalyzer } from '../ai/aiAnalyzer.js';
import { readFileSync } from 'fs';

export async function analyzeFunction(filepath, functionName, options = {}) {
  const git = new GitAnalyzer();
  const ai = new AIAnalyzer();

  // Read file to find function
  const fileContent = readFileSync(filepath, 'utf-8');
  const functionInfo = findFunction(fileContent, functionName, options.lines);

  if (!functionInfo) {
    throw new Error(`Function "${functionName}" not found in ${filepath}`);
  }

  // Get git blame for function lines
  const blame = await git.getBlame(
    filepath,
    functionInfo.startLine,
    functionInfo.endLine
  );

  // Get file history filtered for function changes
  const fullHistory = await git.getFileHistory(filepath, { depth: 50 });
  
  // Filter commits that likely touched this function
  const relatedCommits = fullHistory.filter(commit => {
    // Simple heuristic: commit message mentions function or significant changes
    return commit.message.toLowerCase().includes(functionName.toLowerCase()) ||
           (commit.changes?.added + commit.changes?.removed) > 10;
  });

  // Get AI analysis
  const aiAnalysis = await ai.analyzeFunctionPurpose(
    functionName,
    fullHistory,
    relatedCommits
  );

  // Calculate function metrics
  const metrics = calculateFunctionMetrics(functionInfo, blame, relatedCommits);

  return {
    file: filepath,
    type: 'function',
    function: {
      name: functionName,
      lineRange: `${functionInfo.startLine}-${functionInfo.endLine}`,
      lineCount: functionInfo.endLine - functionInfo.startLine + 1,
      code: functionInfo.code
    },
    metrics,
    blame: blame.slice(0, 5),
    relatedCommits: relatedCommits.slice(0, 10),
    aiAnalysis,
    recommendations: generateFunctionRecommendations(metrics, relatedCommits)
  };
}

function findFunction(content, functionName, lineRange) {
  const lines = content.split('\n');
  
  // If line range provided, use it
  if (lineRange) {
    const [start, end] = lineRange.split('-').map(n => parseInt(n));
    return {
      startLine: start,
      endLine: end,
      code: lines.slice(start - 1, end).join('\n')
    };
  }

  // Try to find function by name
  // Supports: function name(), const name = () =>, name: function()
  const patterns = [
    new RegExp(`function\\s+${functionName}\\s*\\(`),
    new RegExp(`const\\s+${functionName}\\s*=`),
    new RegExp(`${functionName}\\s*:\\s*function`),
    new RegExp(`${functionName}\\s*\\([^)]*\\)\\s*{`), // Arrow functions
    new RegExp(`def\\s+${functionName}\\s*\\(`), // Python
    new RegExp(`public.*\\s+${functionName}\\s*\\(`), // Java/C#
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (patterns.some(pattern => pattern.test(line))) {
      // Found function declaration, now find the end
      const startLine = i + 1;
      let endLine = startLine;
      let braceCount = 0;
      let foundStart = false;

      for (let j = i; j < lines.length; j++) {
        const currentLine = lines[j];
        
        for (const char of currentLine) {
          if (char === '{') {
            braceCount++;
            foundStart = true;
          } else if (char === '}') {
            braceCount--;
          }
        }

        if (foundStart && braceCount === 0) {
          endLine = j + 1;
          break;
        }
      }

      return {
        startLine,
        endLine,
        code: lines.slice(startLine - 1, endLine).join('\n')
      };
    }
  }

  return null;
}

function calculateFunctionMetrics(functionInfo, blame, commits) {
  const metrics = {
    complexity: estimateComplexity(functionInfo.code),
    age: 'Unknown',
    stability: 'Unknown',
    contributors: new Set(blame.map(b => b.author)).size,
    lastModified: commits.length > 0 ? commits[0].date : 'Unknown'
  };

  // Estimate stability based on commit frequency
  if (commits.length === 0) {
    metrics.stability = 'Unknown';
  } else if (commits.length === 1) {
    metrics.stability = 'Stable (never modified)';
  } else if (commits.length < 5) {
    metrics.stability = 'Stable (few changes)';
  } else if (commits.length < 15) {
    metrics.stability = 'Moderate (some changes)';
  } else {
    metrics.stability = 'Unstable (many changes)';
  }

  return metrics;
}

function estimateComplexity(code) {
  // Simple cyclomatic complexity estimation
  const controlFlowKeywords = [
    /\bif\b/g, /\bfor\b/g, /\bwhile\b/g, /\bcase\b/g,
    /\bcatch\b/g, /\b&&\b/g, /\b\|\|\b/g, /\?\s*.*:\s*/g
  ];

  let complexity = 1; // Base complexity
  
  for (const pattern of controlFlowKeywords) {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  }

  let level = 'Low';
  if (complexity > 10) level = 'High';
  else if (complexity > 5) level = 'Medium';

  return { score: complexity, level };
}

function generateFunctionRecommendations(metrics, commits) {
  const recommendations = [];

  // High complexity warning
  if (metrics.complexity.level === 'High') {
    recommendations.push({
      type: 'refactor',
      priority: 'high',
      message: `High complexity (${metrics.complexity.score}) - consider breaking into smaller functions`
    });
  }

  // Many contributors = potential confusion
  if (metrics.contributors > 3) {
    recommendations.push({
      type: 'documentation',
      priority: 'medium',
      message: `${metrics.contributors} different contributors - ensure documentation is clear`
    });
  }

  // Frequent changes
  if (commits.length > 10) {
    recommendations.push({
      type: 'stability',
      priority: 'medium',
      message: `${commits.length} commits found - function may have unclear requirements`
    });
  }

  // Check for panic commits
  const panicCommits = commits.filter(c =>
    /fix|bug|hotfix|urgent/i.test(c.message)
  );

  if (panicCommits.length > 2) {
    recommendations.push({
      type: 'quality',
      priority: 'high',
      message: `${panicCommits.length} urgent fixes detected - thorough testing recommended`
    });
  }

  return recommendations;
}
