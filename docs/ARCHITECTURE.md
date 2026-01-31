# 🏛️ Code Archaeologist - Technical Documentation

## Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                         CLI Layer                            │
│                       (cli.js)                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Analyzer Layer                            │
├─────────────────┬──────────────┬──────────────┬─────────────┤
│  fileAnalyzer   │ functionAnalyzer │ deadCode │ repoAnalyzer│
└────────┬────────┴──────┬───────┴──────┬───────┴─────┬───────┘
         │               │              │             │
         ▼               ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Core Services                            │
├─────────────────┬───────────────────────────────────────────┤
│   GitAnalyzer   │           AIAnalyzer                      │
│  (git history)  │       (Claude integration)                │
└────────┬────────┴───────────────┬───────────────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
├─────────────────┬───────────────────────────────────────────┤
│   simple-git   │        Anthropic API                       │
└─────────────────┴───────────────────────────────────────────┘
```

## Core Components

### 1. CLI Layer (`src/cli.js`)
**Purpose**: Command-line interface and user interaction

**Commands**:
- `file <filepath>` - Analyze single file
- `function <filepath> <name>` - Analyze specific function
- `dead-code [dir]` - Find dead code
- `repo` - Repository overview

**Responsibilities**:
- Parse command-line arguments
- Route to appropriate analyzer
- Handle errors gracefully
- Display results

### 2. Analyzers

#### File Analyzer (`src/analyzers/fileAnalyzer.js`)
**Purpose**: Deep analysis of individual files

**Process**:
1. Validate file exists and is in git
2. Gather git history (commits, authors, changes)
3. Calculate statistics (churn, velocity, authors)
4. Detect urgent commits and patterns
5. Get AI insights
6. Generate recommendations

**Output**:
```javascript
{
  file: string,
  metadata: { created, lastModified, totalCommits, uniqueAuthors },
  stats: { totalAdded, totalRemoved, avgChangeSize, changeVelocity },
  history: Commit[],
  relatedFiles: { file, commits }[],
  aiInsights: { summary, sections },
  codeSmells: Smell[],
  recommendations: Recommendation[]
}
```

#### Function Analyzer (`src/analyzers/functionAnalyzer.js`)
**Purpose**: Analyze specific functions in detail

**Process**:
1. Parse file to locate function
2. Get git blame for function lines
3. Filter relevant commits
4. Calculate complexity metrics
5. Get AI analysis
6. Generate recommendations

**Features**:
- Multiple language support (JS, Python, Java, etc.)
- Cyclomatic complexity estimation
- Contributor tracking
- Stability assessment

#### Dead Code Detector (`src/analyzers/deadCodeDetector.js`)
**Purpose**: Find unused or stale code

**Process**:
1. Recursively scan directory for source files
2. Check last modification date via git
3. Categorize as dead/suspicious/active
4. Generate insights

**Thresholds**:
- Dead: > threshold days
- Suspicious: > 70% of threshold
- Active: < 70% of threshold

#### Repository Analyzer (`src/analyzers/repoAnalyzer.js`)
**Purpose**: Overall repository health assessment

**Metrics**:
- Bug fix ratio: % of commits that are fixes
- Change concentration: % of changes in top files
- Activity trend: Recent vs historical activity
- Health score: 0-100 composite score

### 3. Core Services

#### Git Analyzer (`src/git/gitAnalyzer.js`)
**Purpose**: Git repository interaction

**Key Methods**:
- `getFileHistory()` - Commit history with stats
- `getFileCreationInfo()` - When file was added
- `getLastModification()` - Most recent change
- `getBlame()` - Line-by-line attribution
- `searchCommits()` - Find commits by keyword
- `getRelatedFiles()` - Files changed together

**Features**:
- Diff parsing for change statistics
- Blame parsing for attribution
- Keyword search in messages
- Related file detection

#### AI Analyzer (`src/ai/aiAnalyzer.js`)
**Purpose**: Intelligent insights using Claude

**Key Methods**:
- `analyzeFileHistory()` - Explain why file exists
- `analyzeFunctionPurpose()` - Explain function intent
- `detectCodeSmells()` - Find problematic patterns
- `callClaude()` - API integration

**Fallback Strategy**:
When AI unavailable, uses rule-based analysis:
- Age-based categorization
- Activity level detection
- Pattern matching for urgent commits

### 4. Display Layer (`src/ui/display.js`)
**Purpose**: Beautiful CLI output formatting

**Features**:
- Color-coded severity (red/yellow/green)
- Tables for structured data
- Emoji indicators for quick scanning
- JSON output option

## Data Flow

### File Analysis Flow
```
User Input (filepath)
    ↓
Validate file exists
    ↓
Git History Gathering ─────────────┐
    • Commits                      │
    • Authors                      │
    • Changes (diff stats)         │
    • Creation info                │
    • Related files                │
    ↓                              │
Pattern Detection                  │
    • Urgent commits               │
    • TODO commits                 │
    • Author patterns              │
    ↓                              │
Statistical Analysis               │
    • Change velocity              │
    • Churn rate                   │
    • Author diversity             │
    ↓                              │
AI Analysis ←──────────────────────┘
    • Why created?
    • How evolved?
    • Current status?
    • Red flags?
    ↓
Generate Recommendations
    ↓
Format & Display Results
```

### AI Analysis Flow
```
Git Data (commits, stats)
    ↓
Build Prompt
    • File info
    • Commit history
    • Statistics
    ↓
Call Claude API ───→ [Response]
    ↓                     │
Parse Response           │
    • Extract sections   │
    • Structure data     │
    ↓ (if fails)         │
Fallback Analysis ←──────┘
    • Rule-based
    • Pattern matching
    ↓
Return Insights
```

## Key Algorithms

### 1. Dead Code Detection
```javascript
function categorizeFile(daysAgo, threshold) {
  if (daysAgo > threshold) return 'dead';
  if (daysAgo > threshold * 0.7) return 'suspicious';
  return 'active';
}
```

### 2. Change Velocity Calculation
```javascript
const monthsDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 30);
const velocity = monthsDiff > 0 ? commitCount / monthsDiff : 0;

// Categorize
if (velocity > 5) return 'high';
if (velocity > 2) return 'medium';
return 'low';
```

### 3. Repository Health Score
```javascript
let score = 100;

// Penalize high bug ratio
if (bugRatio > 30) score -= 30;
else if (bugRatio > 20) score -= 20;
else if (bugRatio > 10) score -= 10;

// Penalize change concentration
if (concentration > 50) score -= 20;
else if (concentration > 30) score -= 10;

// Penalize declining activity
if (activityTrend === 'decreasing') score -= 15;

return Math.max(0, score);
```

### 4. Function Complexity Estimation
```javascript
// Simple cyclomatic complexity
let complexity = 1; // Base

// Count control flow keywords
const patterns = [/\bif\b/g, /\bfor\b/g, /\bwhile\b/g, 
                 /\bcase\b/g, /&&/g, /\|\|/g];

patterns.forEach(pattern => {
  const matches = code.match(pattern);
  if (matches) complexity += matches.length;
});

// Categorize
if (complexity > 10) return 'High';
if (complexity > 5) return 'Medium';
return 'Low';
```

## Extension Points

### Adding New Analyzers
```javascript
// src/analyzers/newAnalyzer.js
export async function analyzeX(input, options) {
  const git = new GitAnalyzer();
  const ai = new AIAnalyzer();
  
  // Your analysis logic
  const results = {};
  
  return results;
}

// src/cli.js
program
  .command('new-command <input>')
  .action(async (input, options) => {
    const results = await analyzeX(input, options);
    displayResults(results);
  });
```

### Adding Language Support
```javascript
// In functionAnalyzer.js, add patterns:
const patterns = [
  new RegExp(`function\\s+${functionName}\\s*\\(`), // JS
  new RegExp(`def\\s+${functionName}\\s*\\(`),      // Python
  new RegExp(`func\\s+${functionName}\\s*\\(`),     // Go
  // Add your pattern here
];
```

### Custom AI Prompts
```javascript
// In aiAnalyzer.js
buildCustomPrompt(data) {
  return `Custom analysis for: ${data.name}
  
  Your custom instructions here...
  
  Analyze and provide insights.`;
}
```

## Performance Considerations

### Git Operations
- Limit commit depth with `--max-count`
- Cache results for repeated queries
- Use shallow clones when possible

### AI API Calls
- Rate limiting: Max 5 calls/second
- Token limits: Keep prompts under 4000 tokens
- Fallback to rule-based analysis

### File Scanning
- Skip common directories (node_modules, .git)
- Use file extension filtering
- Parallel processing for large repos

## Error Handling

### Strategy
1. **Validate Early**: Check inputs before processing
2. **Graceful Degradation**: Fall back to simpler analysis
3. **Informative Messages**: Tell user what went wrong
4. **Never Crash**: Catch all exceptions

### Examples
```javascript
// Git errors
try {
  const history = await git.getFileHistory(filepath);
} catch (error) {
  throw new Error(`Failed to get file history: ${error.message}`);
}

// AI errors
try {
  const analysis = await ai.analyzeFile(data);
} catch (error) {
  // Fall back to rule-based
  return this.ruleBasedAnalysis(data);
}
```

## Testing Strategy

### Unit Tests
- Git parsing functions
- Statistical calculations
- Pattern detection
- AI response parsing

### Integration Tests
- Full file analysis
- Command execution
- Output formatting

### Manual Testing
```bash
npm test
node examples/demo.js
```

## Deployment

### NPM Package
```bash
npm publish
```

### GitHub Release
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Docker (Future)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT ["node", "src/cli.js"]
```

## Future Enhancements

### Planned Features
- [ ] Web dashboard
- [ ] VS Code extension
- [ ] GitHub Action
- [ ] Team analytics
- [ ] Code ownership tracking
- [ ] Dependency analysis
- [ ] Security vulnerability detection
- [ ] Performance regression detection

### Technical Debt
- [ ] Add comprehensive test suite
- [ ] Improve AST parsing for functions
- [ ] Add caching layer
- [ ] Support monorepos
- [ ] Add configuration file support
- [ ] Optimize git operations

---

**Last Updated**: January 2024
**Maintainers**: Code Archaeologist Team
