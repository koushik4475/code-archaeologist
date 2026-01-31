#!/bin/bash

# Code Archaeologist Setup Script
# This script helps you install and configure Code Archaeologist

set -e

echo "🏛️  Code Archaeologist Setup"
echo "================================"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18 or higher from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old"
    echo "Please upgrade to Node.js 18 or higher"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if in git repository
echo "Checking for git repository..."
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "⚠️  Not in a git repository"
    echo "Code Archaeologist works best in git repositories"
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    echo "✅ Git repository detected"
fi
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Link CLI globally (optional)
echo "Do you want to install 'code-arch' command globally? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "Installing globally..."
    npm link
    echo "✅ 'code-arch' command is now available globally"
else
    echo "Skipping global installation"
    echo "You can run commands using: node src/cli.js"
fi
echo ""

# Run tests
echo "Running tests..."
npm test
echo "✅ Tests passed"
echo ""

# Run demo (optional)
echo "Do you want to run the demo? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "Running demo..."
    echo "================================"
    node examples/demo.js
fi

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Quick start commands:"
echo "  code-arch file <filepath>        # Analyze a file"
echo "  code-arch dead-code . --recursive  # Find dead code"
echo "  code-arch repo                   # Repository overview"
echo ""
echo "Documentation:"
echo "  README.md           - Full documentation"
echo "  docs/QUICKSTART.md  - Quick start guide"
echo "  docs/ARCHITECTURE.md - Technical details"
echo ""
echo "Happy excavating! 🏛️"
