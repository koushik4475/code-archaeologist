# 🏛️ Code Archaeologist

> AI-powered tool to understand **why code exists**, not just what it does.

Ever inherited a mysterious codebase and wondered "WTF is this code doing here?" Code Archaeologist excavates your Git history and uses AI to tell you the story behind your code.

## ✨ Features

- 🔍 **File Analysis** - Understand why files were created and how they evolved
- ⚡ **Function Analysis** - Deep dive into specific functions with AI insights
- 🪦 **Dead Code Detection** - Find files that haven't been touched in ages
- 🏛️ **Repository Overview** - Get a bird's-eye view of your codebase health
- 🤖 **AI-Powered Insights** - Claude analyzes commit patterns to explain intent
- 📊 **Rich Statistics** - Track changes, contributors, and technical debt

## 🚀 Installation

```bash
npm install -g code-archaeologist
```

Or run locally:

```bash
git clone https://github.com/yourusername/code-archaeologist.git
cd code-archaeologist
npm install
npm link
```

## 📖 Usage

### Analyze a File

```bash
code-arch file src/components/UserAuth.js
```

**Output:**
```
🔍 Excavating src/components/UserAuth.js...

📄 File Analysis: src/components/UserAuth.js

📊 Metadata
  Created: 2022-03-15 by Alice Chen
  Last Modified: 2024-01-28 (3 days ago)
  Total Commits: 23
  Unique Authors: 4

📈 Statistics
  Lines Added: 456
  Lines Removed: 234
  Avg Change Size: 30 lines
  Change Velocity: high (3.2 commits/month)

🤖 AI Analysis
  This file was created as a rushed hotfix for a critical authentication
  bug discovered during the Safari 15 rollout. Initially intended as a
  temporary workaround, it became permanent due to time constraints.
  The high number of bug fixes (8 urgent commits) suggests unclear
  requirements around OAuth token handling.

⚠️  Code Smells Detected
  🔴 panic_driven: Found 8 urgent/hotfix commits
     • 2023-11-20 (a3f2c1b): URGENT: Fix Safari cookie issue
     • 2023-09-14 (7bd4e8a): HOTFIX: OAuth token expiry bug

💡 Recommendations
  🔴 high_churn: High change frequency detected - may indicate instability
  🔴 technical_debt: Technical debt detected - review and refactor recommended
```

### Analyze a Specific Function

```bash
code-arch function src/utils/validator.js validateEmail
```

**Output:**
```
⚡ Function Analysis: validateEmail

📍 Location
  File: src/utils/validator.js
  Lines: 45-67 (23 lines)

📊 Metrics
  Complexity: Medium (7)
  Contributors: 3
  Stability: Unstable (many changes)
  Last Modified: 2024-01-15

🤖 AI Analysis
  Originally a simple regex check, this function evolved into a complex
  validator after multiple edge cases were discovered (international
  domains, plus addressing). The 12 commits suggest requirements weren't
  clear initially. Recent changes indicate ongoing issues with email
  validation standards.

💡 Recommendations
  🟡 stability: 12 commits found - function may have unclear requirements
  🔴 quality: 4 urgent fixes detected - thorough testing recommended
```

### Detect Dead Code

```bash
code-arch dead-code src/ --recursive --threshold 365
```

**Output:**
```
🪦 Scanning for dead code...

🪦 Dead Code Scan: src/

📊 Summary
  Total Files Scanned: 87
  Dead Code Files: 12
  Suspicious Files: 8
  Active Files: 67

💡 Insights
  • Found 12 files (13.8%) untouched for 365+ days
  • Oldest untouched file: src/legacy/parser.js (987 days)
  • Most dead code in .js files (9 files)

🔴 Dead Code Files (Top 10)
┌─────────────────────────────────────┬────────────┬──────────┬──────────────┐
│ File                                │ Last Mod   │ Days Ago │ Author       │
├─────────────────────────────────────┼────────────┼──────────┼──────────────┤
│ src/legacy/parser.js                │ 2021-04-12 │ 987      │ Bob Williams │
│ src/utils/deprecated.js             │ 2021-08-20 │ 857      │ Alice Chen   │
│ src/old/formatter.js                │ 2022-01-05 │ 723      │ Carol Davis  │
└─────────────────────────────────────┴────────────┴──────────┴──────────────┘
```

### Repository Overview

```bash
code-arch repo --since 2023-01-01 --top 10
```

**Output:**
```
🏛️  Excavating repository history...

🏛️  Repository Analysis

📊 Summary
  Total Commits: 1,247
  Unique Contributors: 15
  Date Range: 2023-01-01 to 2024-01-31

🏥 Health Metrics
  Overall Health: fair (65/100)
  Bug Fix Ratio: 23.4%
  Change Concentration: 42.1%
  Activity Trend: stable

💡 Insights
  🟡 High bug fix ratio (23.4%) - quality issues detected
  🟡 42.1% of changes in top 10 files - potential hotspots

🔥 Hotspot Files (Most Changed)
┌────────────────────────────────────────┬─────────┐
│ File                                   │ Commits │
├────────────────────────────────────────┼─────────┤
│ src/api/auth.js                        │ 89      │
│ src/components/Dashboard.jsx           │ 67      │
│ src/utils/validation.js                │ 54      │
└────────────────────────────────────────┴─────────┘

👥 Top Contributors
  Alice Chen               ████████████████████████ 234
  Bob Williams             ███████████████ 156
  Carol Davis              ████████ 87
```

## 🎯 Use Cases

### 1. **Onboarding New Team Members**
"Why does this weird authentication flow exist?"
```bash
code-arch file src/auth/oauth-handler.js
```

### 2. **Refactoring Planning**
"Is this function safe to delete?"
```bash
code-arch function src/utils/legacy.js processData
```

### 3. **Technical Debt Assessment**
"How much dead code do we have?"
```bash
code-arch dead-code src/ --recursive
```

### 4. **Code Review Context**
"What's the history of this hotspot file?"
```bash
code-arch file src/api/payment.js --depth 50
```

### 5. **Sprint Retrospectives**
"Where are we spending most of our time?"
```bash
code-arch repo --since 2024-01-01
```

## 🏗️ How It Works

1. **Git History Mining**: Analyzes commits, diffs, and blame data
2. **Pattern Detection**: Identifies urgent fixes, TODOs, and code smells
3. **AI Analysis**: Uses Claude to understand *intent* from commit messages
4. **Actionable Insights**: Generates recommendations based on patterns

## 🎨 Features in Detail

### File Analysis
- Creation date and original author
- Commit history with change statistics
- AI-powered purpose analysis
- Related files frequently changed together
- Code smell detection (panic commits, TODOs)

### Function Analysis
- Line-level git blame
- Cyclomatic complexity estimation
- Contributor count and stability metrics
- Historical commit context
- Refactoring recommendations

### Dead Code Detection
- Configurable inactivity threshold
- Recursive directory scanning
- Language-agnostic (works with any git-tracked files)
- Sorted by age for easy prioritization

### Repository Overview
- Commit activity timeline
- Top contributors and hotspot files
- Health score calculation
- Bug fix ratio analysis
- Change concentration metrics

## ⚙️ Configuration

Create a `.code-arch.json` in your project root:

```json
{
  "excludePaths": [
    "node_modules",
    "dist",
    "build"
  ],
  "defaultDepth": 20,
  "deadCodeThreshold": 365,
  "aiProvider": "anthropic"
}
```

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with [simple-git](https://github.com/steveukx/git-js)
- AI powered by [Anthropic Claude](https://www.anthropic.com)
- Inspired by the pain of maintaining legacy codebases 😅

## 🐛 Issues & Feature Requests

Found a bug? Have an idea? [Open an issue](https://github.com/yourusername/code-archaeologist/issues)

---

**Made with ❤️ by developers who've inherited too much legacy code**
