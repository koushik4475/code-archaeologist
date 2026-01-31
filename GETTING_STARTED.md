# 🎯 Getting Started with Code Archaeologist

Welcome! This guide will have you analyzing code in 5 minutes.

## 📦 Installation

### Option 1: From Source (Recommended for Development)

```bash
# Clone the repository
git clone https://github.com/yourusername/code-archaeologist.git
cd code-archaeologist

# Run setup script (installs dependencies, runs tests)
chmod +x setup.sh
./setup.sh

# Or manually:
npm install
npm link  # Makes 'code-arch' available globally
npm test  # Verify installation
```

### Option 2: From NPM (Future)

```bash
npm install -g code-archaeologist
```

## 🚀 Quick Test

Try these commands to verify everything works:

```bash
# Navigate to any git repository
cd /path/to/your/project

# Analyze a file
code-arch file package.json

# Check for dead code
code-arch dead-code . --recursive --threshold 180

# Get repository overview
code-arch repo --top 5
```

## 📚 Your First Analysis

Let's analyze a file step-by-step:

### 1. Pick a File
Choose any file in your git repository. Let's use `src/index.js`:

```bash
code-arch file src/index.js
```

### 2. Understanding the Output

You'll see several sections:

**📊 Metadata**: Basic file information
```
Created: 2022-03-15 by Alice Chen
Last Modified: 2024-01-28 (3 days ago)
Total Commits: 23
```

**📈 Statistics**: Change metrics
```
Lines Added: 456
Change Velocity: high (3.2 commits/month)
```

**🤖 AI Analysis**: Why the file exists
```
This file was created as a rushed hotfix for a critical
authentication bug. The high number of bug fixes suggests
unclear requirements.
```

**⚠️ Code Smells**: Detected issues
```
🔴 panic_driven: Found 8 urgent/hotfix commits
```

**💡 Recommendations**: What to do
```
🔴 high_churn: High change frequency - may indicate instability
🟡 technical_debt: Review and refactor recommended
```

## 🎮 Interactive Tutorial

### Exercise 1: Find Your Hotspots

Find the most frequently changed files in your repo:

```bash
code-arch repo --top 10
```

**What to look for:**
- Files with 50+ commits might be hotspots
- High bug fix ratio (>20%) suggests quality issues

### Exercise 2: Dead Code Hunt

Find files that haven't been touched in a year:

```bash
code-arch dead-code . --recursive --threshold 365
```

**What to do:**
- Review files in the "Dead Code" section
- Check if they're still needed
- Consider removing or documenting them

### Exercise 3: Understand a Complex Function

Pick a complex function and analyze it:

```bash
code-arch function src/utils.js validateEmail
```

**Key metrics:**
- **Complexity**: High = refactor needed
- **Contributors**: Many = add documentation
- **Stability**: Unstable = unclear requirements

## 🛠️ Advanced Usage

### Increase Analysis Depth

By default, code-arch looks at the last 10 commits. To go deeper:

```bash
code-arch file src/critical.js --depth 50
```

### JSON Output for Automation

Export results as JSON for scripts/CI:

```bash
code-arch file src/index.js --json > analysis.json
```

### Analyze Recent Changes Only

Focus on recent activity:

```bash
code-arch repo --since 2024-01-01
```

### Custom Thresholds

Adjust what counts as "dead code":

```bash
code-arch dead-code . --threshold 180  # 6 months instead of 1 year
```

## 💡 Real-World Workflows

### Workflow 1: Onboarding New Team Member

Create an onboarding document:

```bash
# Analyze key files
code-arch file src/api/auth.js > docs/auth-history.txt
code-arch file src/components/Dashboard.jsx > docs/dashboard-history.txt

# Get repository overview
code-arch repo --top 20 > docs/repo-overview.txt
```

Share these docs with new team members!

### Workflow 2: Sprint Planning

Before a sprint, assess technical debt:

```bash
# Find dead code to clean up
code-arch dead-code src/ --recursive > tech-debt/dead-code.txt

# Identify hotspots needing attention
code-arch repo --top 20 > tech-debt/hotspots.txt
```

### Workflow 3: Code Review

Before reviewing a PR, understand the file's history:

```bash
# Analyze changed file
code-arch file src/changed-file.js --depth 20

# Check function complexity
code-arch function src/changed-file.js newFunction
```

### Workflow 4: Refactoring Planning

Decide what to refactor:

```bash
# Find high-complexity functions
for file in src/**/*.js; do
    code-arch file "$file" --json >> complexity-report.json
done

# Analyze dead code for removal
code-arch dead-code src/ --recursive --threshold 365
```

## 🎨 Customization

### Configuration File (Future Feature)

Create `.code-arch.json` in your project root:

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

### Custom Scripts

Create custom analysis scripts:

```javascript
// analyze-all.js
import { analyzeFile } from 'code-archaeologist';

const files = ['src/index.js', 'src/auth.js'];

for (const file of files) {
  const results = await analyzeFile(file, { depth: 50 });
  console.log(`${file}: ${results.stats.changeVelocity} velocity`);
}
```

## 🐛 Troubleshooting

### "File not found"
- Use relative paths from current directory
- Check that file exists: `ls src/index.js`

### "Not a git repository"
- Run `git init` if this is a new project
- Or `cd` into an existing git repo

### "File is not tracked by git"
- Commit the file first: `git add . && git commit -m "Add file"`

### "AI analysis failed"
- Tool falls back to rule-based analysis automatically
- Check network connection if you need AI features

### "Function not found"
- Try providing line range: `--lines "10-50"`
- Check function name spelling
- Function detection works best with standard syntax

## 🎓 Tips & Best Practices

### 1. Start Small
Begin with one important file to understand the output format.

### 2. Regular Health Checks
Run `code-arch repo` weekly to track trends.

### 3. Document Findings
Save interesting analyses for team reference.

### 4. Combine Tools
Use with other tools like SonarQube or ESLint.

### 5. Share Insights
Add findings to PR descriptions or code comments.

### 6. Automate
Add to CI/CD to track complexity over time.

## 📈 Measuring Success

Track these metrics monthly:

- **Dead Code**: Decreasing = good cleanup
- **Health Score**: Increasing = improving codebase
- **Bug Fix Ratio**: Decreasing = better quality
- **Hotspot Count**: Decreasing = spreading changes

## 🔗 Next Steps

1. **Read Full Docs**: Check out [README.md](README.md)
2. **Technical Details**: See [ARCHITECTURE.md](docs/ARCHITECTURE.md)
3. **Contribute**: Read [CONTRIBUTING.md](CONTRIBUTING.md)
4. **Share Feedback**: Open an issue on GitHub

## 💬 Get Help

- **GitHub Issues**: Bug reports & feature requests
- **Discussions**: Questions & community support
- **Email**: maintainers@codearchaeologist.dev

## 🎉 You're Ready!

You now know how to:
- ✅ Analyze files and functions
- ✅ Find dead code
- ✅ Assess repository health
- ✅ Create custom workflows
- ✅ Troubleshoot issues

**Start excavating your codebase!** 🏛️

---

Need more help? Check the [FAQ](docs/FAQ.md) or join our [Discord](https://discord.gg/code-arch).
