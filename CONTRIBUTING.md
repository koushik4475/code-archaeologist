# Contributing to Code Archaeologist

Thank you for your interest in contributing! 🎉

## 🚀 Quick Start

1. **Fork & Clone**
```bash
git clone https://github.com/yourusername/code-archaeologist.git
cd code-archaeologist
npm install
```

2. **Create a Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make Your Changes**
- Write clean, documented code
- Follow existing code style
- Add tests if applicable

4. **Test Your Changes**
```bash
npm test
node examples/demo.js
```

5. **Commit & Push**
```bash
git commit -m "feat: add amazing feature"
git push origin feature/your-feature-name
```

6. **Open a Pull Request**

## 📝 Commit Message Format

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, etc)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance

Example: `feat: add support for Python function analysis`

## 🎯 Areas to Contribute

### High Priority
- [ ] Support for more languages (Python, Java, Go)
- [ ] Better AST parsing for accurate function detection
- [ ] Configuration file support
- [ ] GitHub Action integration
- [ ] Web UI dashboard

### Medium Priority
- [ ] Custom AI prompts
- [ ] Export reports (PDF, HTML)
- [ ] Integration with issue trackers
- [ ] Caching for faster repeated scans
- [ ] Multi-repo analysis

### Good First Issues
- [ ] Add more code smell patterns
- [ ] Improve error messages
- [ ] Add examples for different languages
- [ ] Write more tests
- [ ] Improve documentation

## 🐛 Bug Reports

When reporting bugs, include:

1. Code Archaeologist version
2. Node.js version
3. Operating system
4. Steps to reproduce
5. Expected vs actual behavior
6. Relevant logs/screenshots

## 💡 Feature Requests

Before suggesting a feature:

1. Check existing issues
2. Explain the use case
3. Describe expected behavior
4. Consider implementation complexity

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
node --test tests/gitAnalyzer.test.js
```

## 📖 Code Style

- Use ESM modules (`import/export`)
- Prefer `const` over `let`
- Use descriptive variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Use async/await over promises

## 🏗️ Project Structure

```
code-archaeologist/
├── src/
│   ├── analyzers/       # Core analysis logic
│   ├── ai/             # AI integration
│   ├── git/            # Git operations
│   ├── ui/             # Display formatting
│   └── cli.js          # CLI entry point
├── examples/           # Example usage
├── tests/              # Test files
└── docs/               # Documentation
```

## ✅ Pull Request Checklist

- [ ] Code follows project style
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Commits follow convention
- [ ] Branch is up-to-date with main
- [ ] No unnecessary dependencies added

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## 📫 Questions?

- Open a [Discussion](https://github.com/yourusername/code-archaeologist/discussions)
- Join our [Discord](https://discord.gg/code-arch) (coming soon)
- Email: maintainers@code-archaeologist.dev

---

**Thank you for making Code Archaeologist better!** 🙏
