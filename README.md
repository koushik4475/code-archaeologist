<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Code%20Archaeologist&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=fff" />

<!-- Typing Animation -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=F75C7E&center=true&vCenter=true&width=600&lines=Excavate+Your+Code+History+%F0%9F%8F%9B%EF%B8%8F;Understand+WHY+Code+Exists;AI-Powered+Insights+%F0%9F%A4%96;Never+Wonder+WTF+Again!" alt="Typing SVG" /></a>

<br/>

<!-- Badges with Animation -->
<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge&logo=semver&logoColor=white" />
  <img src="https://img.shields.io/badge/node-%3E%3D16.0.0-green?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-Claude-purple?style=for-the-badge&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-orange?style=for-the-badge&logo=opensourceinitiative&logoColor=white" />
</p>

<!-- Social Proof -->
<p align="center">
  <img src="https://img.shields.io/github/stars/koushik4475/code-archaeologist?style=social" />
  <img src="https://img.shields.io/github/forks/koushik4475/code-archaeologist?style=social" />
  <img src="https://img.shields.io/github/watchers/koushik4475/code-archaeologist?style=social" />
</p>

<!-- Quick Links with Icons -->
<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-examples">Examples</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br/>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

</div>

<br/>

## 🌟 What is Code Archaeologist?

<table>
<tr>
<td width="50%">

Ever inherited a mysterious codebase and thought:

> **"WTF is this code doing here?"** 🤔

Code Archaeologist is your AI-powered time machine that excavates Git history to tell you the **story behind your code**, not just what it does.

</td>
<td width="50%">

```bash
$ code-arch file legacy.js

🤖 AI Analysis:
This file was a rushed hotfix
during the Safari 15 rollout.
Originally temporary, it became
permanent due to time constraints.

⚠️  8 urgent commits detected!
💡 Recommend: Refactor ASAP
```

</td>
</tr>
</table>

<br/>

## ✨ Features

<div align="center">

| 🔍 **File Analysis** | ⚡ **Function Deep Dive** | 🪦 **Dead Code Detection** |
|:---:|:---:|:---:|
| Understand file creation<br/>and evolution story | AI-powered insights on<br/>specific functions | Find forgotten code<br/>gathering dust |
| **🏛️ Repository Overview** | **🤖 AI-Powered Insights** | **📊 Rich Statistics** |
| Bird's-eye view of<br/>codebase health | Claude analyzes commit<br/>patterns & intent | Track changes, contributors,<br/>& technical debt |

</div>

<details>
<summary><b>🎯 Click to see feature highlights!</b></summary>

<br/>

- ✅ **Smart Pattern Detection** - Identifies urgent fixes, TODOs, and code smells automatically
- ✅ **Multi-Language Support** - Works with any Git-tracked files
- ✅ **Actionable Recommendations** - Not just data, but what to *do* about it
- ✅ **Beautiful CLI Output** - Color-coded, emoji-rich, terminal-friendly
- ✅ **Fast & Lightweight** - Minimal dependencies, maximum speed
- ✅ **Configurable** - Customize thresholds, exclusions, and AI behavior

</details>

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
</div>

## 🚀 Installation

<table>
<tr>
<td>

### Global Installation (Recommended)

```bash
npm install -g code-archaeologist
```

</td>
<td>

### Local Development

```bash
git clone https://github.com/koushik4475/code-archaeologist.git
cd code-archaeologist
npm install
npm link
```

</td>
</tr>
</table>

**Requirements:** Node.js ≥ 16.0.0, Git installed

<br/>

## 📖 Usage

### 🎬 Quick Start Demo

```bash
# Code Archaeologist | AI-Assisted Codebase Analysis and Repository Exploration CLI

Code Archaeologist is a developer command-line tool for understanding unfamiliar codebases. It helps inspect files and functions, trace code behavior, identify potentially unused code, and review repository structure with AI-assisted analysis. It is designed for developers onboarding to legacy projects, performing code reviews, or investigating inherited software; validate automated findings before changing production code.

code-arch file src/components/UserAuth.js

# Deep dive into a function
code-arch function src/utils/validator.js validateEmail

# Find dead code
code-arch dead-code src/ --recursive --threshold 365

# Repository health check
code-arch repo --since 2023-01-01
```

<br/>

<details open>
<summary><h3>🔍 File Analysis - Example Output</h3></summary>

```bash
$ code-arch file src/components/UserAuth.js

🔍 Excavating src/components/UserAuth.js...

┌─────────────────────────────────────────────────────────────┐
│  📄 File Analysis: src/components/UserAuth.js               │
└─────────────────────────────────────────────────────────────┘

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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This file was created as a rushed hotfix for a critical 
authentication bug discovered during the Safari 15 rollout. 
Initially intended as a temporary workaround, it became 
permanent due to time constraints. The high number of bug 
fixes (8 urgent commits) suggests unclear requirements 
around OAuth token handling.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Code Smells Detected
  🔴 panic_driven: Found 8 urgent/hotfix commits
     • 2023-11-20 (a3f2c1b): URGENT: Fix Safari cookie issue
     • 2023-09-14 (7bd4e8a): HOTFIX: OAuth token expiry bug

💡 Recommendations
  🔴 high_churn: High change frequency - indicates instability
  🔴 technical_debt: Review and refactor recommended
```

</details>

<details>
<summary><h3>⚡ Function Analysis - Example Output</h3></summary>

```bash
$ code-arch function src/utils/validator.js validateEmail

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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Originally a simple regex check, this function evolved into 
a complex validator after multiple edge cases were discovered 
(international domains, plus addressing). The 12 commits 
suggest requirements weren't clear initially.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Recommendations
  🟡 stability: 12 commits - unclear requirements
  🔴 quality: 4 urgent fixes - needs testing
```

</details>

<details>
<summary><h3>🪦 Dead Code Detection - Example Output</h3></summary>

```bash
$ code-arch dead-code src/ --recursive --threshold 365

🪦 Scanning for dead code in src/...

┌─────────────────────────────────────────────────────────────┐
│  💀 Dead Code Scan Results                                  │
└─────────────────────────────────────────────────────────────┘

📊 Summary
  Total Files Scanned: 87
  Dead Code Files: 12 (13.8%)
  Suspicious Files: 8
  Active Files: 67

🔴 Top 10 Dead Files
┌───────────────────────────────┬────────────┬──────────┬──────────────┐
│ File                          │ Last Mod   │ Days Ago │ Author       │
├───────────────────────────────┼────────────┼──────────┼──────────────┤
│ src/legacy/parser.js          │ 2021-04-12 │ 987      │ Bob Williams │
│ src/utils/deprecated.js       │ 2021-08-20 │ 857      │ Alice Chen   │
│ src/old/formatter.js          │ 2022-01-05 │ 723      │ Carol Davis  │
└───────────────────────────────┴────────────┴──────────┴──────────────┘

💡 Potential Savings: ~1,247 lines of code
```

</details>

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
</div>

## 🎯 Use Cases

<div align="center">

```mermaid
graph LR
    A[🆕 New Team Member] --> B{Code Confusion}
    B --> C[code-arch file]
    C --> D[✨ Understand Intent]
    
    E[🔧 Refactoring] --> F{Safe to Delete?}
    F --> G[code-arch function]
    G --> H[✅ Confident Decision]
    
    I[🏢 Tech Debt Review] --> J{How Much Debt?}
    J --> K[code-arch dead-code]
    K --> L[📊 Clear Metrics]
```

</div>

<table>
<tr>
<td width="50%">

### 👨‍💻 Developer Scenarios

1. **Onboarding** - "Why does this exist?"
   ```bash
   code-arch file src/auth/oauth.js
   ```

2. **Refactoring** - "Is this safe to delete?"
   ```bash
   code-arch function src/legacy.js oldAPI
   ```

3. **Code Review** - "What's the context?"
   ```bash
   code-arch file src/payment.js --depth 50
   ```

</td>
<td width="50%">

### 🏢 Team Scenarios

1. **Tech Debt Assessment**
   ```bash
   code-arch dead-code src/ --recursive
   ```

2. **Sprint Retrospectives**
   ```bash
   code-arch repo --since 2024-01-01
   ```

3. **Quality Metrics**
   ```bash
   code-arch repo --top 10
   ```

</td>
</tr>
</table>

<br/>

## 🏗️ How It Works

<div align="center">

```mermaid
graph TD
    A[📂 Your Codebase] --> B[🔍 Git History Mining]
    B --> C[📊 Pattern Detection]
    C --> D[🤖 AI Analysis]
    D --> E[💡 Actionable Insights]
    
    B --> F[Commits & Diffs]
    B --> G[Git Blame Data]
    
    C --> H[Urgent Fixes]
    C --> I[Code Smells]
    C --> J[TODOs]
    
    D --> K[Claude AI]
    K --> L[Intent Understanding]
    
    E --> M[📈 Recommendations]
```

</div>

<br/>

**The Magic Behind the Scenes:**

1. 🔎 **Git Mining** - Extracts commits, diffs, and blame data
2. 🧩 **Pattern Recognition** - Identifies urgent fixes, TODOs, smells
3. 🧠 **AI Understanding** - Claude analyzes *why*, not just *what*
4. 💎 **Insight Generation** - Actionable recommendations

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
</div>

## ⚙️ Configuration

Create `.code-arch.json` in your project root:

```json
{
  "excludePaths": [
    "node_modules",
    "dist",
    "build",
    ".git"
  ],
  "defaultDepth": 20,
  "deadCodeThreshold": 365,
  "aiProvider": "anthropic",
  "complexityThreshold": 10,
  "hotspotMinCommits": 15
}
```

<details>
<summary><b>📋 Configuration Options</b></summary>

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `excludePaths` | Array | `[]` | Directories to ignore |
| `defaultDepth` | Number | `20` | Default commit history depth |
| `deadCodeThreshold` | Number | `365` | Days before code is "dead" |
| `aiProvider` | String | `anthropic` | AI service provider |
| `complexityThreshold` | Number | `10` | Max acceptable complexity |
| `hotspotMinCommits` | Number | `15` | Min commits for hotspot |

</details>

<br/>

## 🤝 Contributing

<div align="center">

We ❤️ contributions! Here's how you can help make Code Archaeologist even better:

</div>

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m '✨ Add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=koushik4475/code-archaeologist)](https://github.com/koushik4475/code-archaeologist/graphs/contributors)

</div>

<br/>

## 📊 Project Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=koushik4475&show_icons=true&theme=radical&hide_border=true&bg_color=0D1117&title_color=F75C7E&icon_color=F8D866&text_color=FFFFFF" alt="GitHub Stats" width="48%" />
<img src="https://github-readme-streak-stats.herokuapp.com/?user=koushik4475&theme=radical&hide_border=true&background=0D1117&stroke=F75C7E&ring=F75C7E&fire=F8D866&currStreakLabel=F75C7E" alt="GitHub Streak" width="48%" />

<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=koushik4475&layout=compact&theme=radical&hide_border=true&bg_color=0D1117&title_color=F75C7E&text_color=FFFFFF" alt="Top Languages" width="48%" />
<img src="https://github-readme-activity-graph.vercel.app/graph?username=koushik4475&theme=react-dark&hide_border=true&area=true&bg_color=0D1117&color=F75C7E&line=F8D866&point=FFFFFF" alt="Contribution Graph" width="98%" />

</div>

<br/>

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
</div>

## 🙏 Acknowledgments

<table>
<tr>
<td align="center" width="33%">
<img src="https://skillicons.dev/icons?i=git" width="40"/><br/>
<b>simple-git</b><br/>
<sub>Git operations</sub>
</td>
<td align="center" width="33%">
<img src="https://www.anthropic.com/images/icons/apple-touch-icon.png" width="40"/><br/>
<b>Anthropic Claude</b><br/>
<sub>AI-powered insights</sub>
</td>
<td align="center" width="33%">
<img src="https://skillicons.dev/icons?i=nodejs" width="40"/><br/>
<b>Node.js</b><br/>
<sub>Runtime environment</sub>
</td>
</tr>
</table>

<div align="center">

**Special thanks to all developers who've inherited legacy code and survived! 💪**

</div>

<br/>

## 📜 License

<div align="center">

MIT License © 2024 [Koushik](https://github.com/koushik4475)

See [LICENSE](LICENSE) file for details

</div>

<br/>

## 🐛 Issues & Support

<div align="center">

Found a bug? Have an idea? We'd love to hear from you!

[![Report Bug](https://img.shields.io/badge/🐛-Report%20Bug-red?style=for-the-badge)](https://github.com/koushik4475/code-archaeologist/issues)
[![Request Feature](https://img.shields.io/badge/💡-Request%20Feature-blue?style=for-the-badge)](https://github.com/koushik4475/code-archaeologist/issues)
[![Ask Question](https://img.shields.io/badge/❓-Ask%20Question-green?style=for-the-badge)](https://github.com/koushik4475/code-archaeologist/discussions)

</div>

<br/>

## 🌟 Show Your Support

<div align="center">

If Code Archaeologist helped you understand your codebase better, give it a ⭐!

It really helps the project grow! 🚀

<a href="https://github.com/koushik4475/code-archaeologist/stargazers">
  <img src="https://img.shields.io/github/stars/koushik4475/code-archaeologist?style=social" alt="Star on GitHub">
</a>

</div>

<br/>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" />

**Made with ❤️ and ☕ by developers who've seen too much legacy code**

<sub>Now go excavate some mysteries! 🏛️✨</sub>

</div>
