# 🚀 Quick Start Guide

Get started with Code Archaeologist in 5 minutes!

## Installation

### Global Install (Recommended)
```bash
npm install -g code-archaeologist
```

### Local Install
```bash
git clone https://github.com/yourusername/code-archaeologist.git
cd code-archaeologist
npm install
npm link
```

## Your First Analysis

### 1. Navigate to Your Git Repository
```bash
cd /path/to/your/project
```

### 2. Analyze a File
```bash
code-arch file src/index.js
```

You'll see:
- When the file was created and by whom
- Commit history with change statistics
- AI analysis of why it exists
- Code smells and recommendations

### 3. Find Dead Code
```bash
code-arch dead-code . --recursive --threshold 365
```

Finds files untouched for 365+ days.

### 4. Analyze a Function
```bash
code-arch function src/utils.js parseData
```

Gets detailed info about a specific function.

### 5. Repository Overview
```bash
code-arch repo --top 10
```

See your repo's health metrics and hotspot files.

## Common Use Cases

### Onboarding New Developers
```bash
# Understand key files
code-arch file src/api/auth.js
code-arch file src/components/Dashboard.jsx

# See repository overview
code-arch repo --since 2023-01-01
```

### Refactoring Planning
```bash
# Find dead code to remove
code-arch dead-code src/ --recursive

# Analyze complex functions
code-arch function src/legacy.js processData

# Identify hotspots
code-arch repo --top 20
```

### Code Review
```bash
# Understand file history before reviewing
code-arch file src/changed-file.js --depth 20

# Check function complexity
code-arch function src/new-feature.js complexFunction
```

### Technical Debt Assessment
```bash
# Scan for old, untouched code
code-arch dead-code . --recursive --threshold 730

# Repository health check
code-arch repo
```

## Tips & Tricks

### Use JSON Output for Automation
```bash
code-arch file src/index.js --json > analysis.json
```

### Increase Analysis Depth
```bash
code-arch file src/critical.js --depth 50
```

### Focus on Recent Changes
```bash
code-arch repo --since 2024-01-01
```

### Analyze Specific Line Ranges
```bash
code-arch function src/file.js myFunction --lines "10-50"
```

## Understanding the Output

### Severity Indicators
- 🔴 **High**: Immediate attention needed
- 🟡 **Medium**: Should be addressed soon
- 🔵 **Low**: Nice to have

### Code Smell Types
- `panic_driven`: Urgent/hotfix commits
- `technical_debt`: TODO/temp/hack commits
- `high_churn`: Frequent changes
- `potential_dead_code`: Inactive files

### Health Scores
- **Good (70-100)**: Healthy codebase
- **Fair (40-69)**: Some issues to address
- **Poor (0-39)**: Significant problems

## Troubleshooting

### "File not found"
Make sure the file path is relative to current directory.

### "Not a git repository"
Code Archaeologist only works in git repositories. Run `git init` if needed.

### "No git history"
The file must have at least one commit. Stage and commit changes first.

### AI Analysis Not Working
The tool falls back to rule-based analysis if AI is unavailable. Core features still work.

## Next Steps

1. Read the full [README](README.md)
2. Check out [examples](examples/)
3. Join our community (Discord/GitHub Discussions)
4. Star the repo if you find it useful! ⭐

## Need Help?

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/yourusername/code-archaeologist/issues)
- 💬 [Discussions](https://github.com/yourusername/code-archaeologist/discussions)

---

Happy excavating! 🏛️
