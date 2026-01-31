#!/usr/bin/env node

/**
 * Demo Script - Shows Code Archaeologist capabilities
 * Run with: node examples/demo.js
 */

import { analyzeFile } from '../src/analyzers/fileAnalyzer.js';
import { analyzeFunction } from '../src/analyzers/functionAnalyzer.js';
import { detectDeadCode } from '../src/analyzers/deadCodeDetector.js';
import { displayResults } from '../src/ui/display.js';
import chalk from 'chalk';

async function runDemo() {
  console.log(chalk.bold.cyan('\n🏛️  CODE ARCHAEOLOGIST DEMO\n'));
  console.log(chalk.gray('This demo analyzes the Code Archaeologist project itself!\n'));

  try {
    // Demo 1: Analyze a file
    console.log(chalk.bold('📄 DEMO 1: Analyzing a file...\n'));
    const fileResults = await analyzeFile('package.json', { depth: 5 });
    displayResults(fileResults);

    console.log('\n' + '='.repeat(80) + '\n');

    // Demo 2: Analyze a function (simulated with line range)
    console.log(chalk.bold('⚡ DEMO 2: Analyzing a function...\n'));
    try {
      const functionResults = await analyzeFunction(
        'src/analyzers/fileAnalyzer.js',
        'analyzeFile',
        {}
      );
      displayResults(functionResults);
    } catch (error) {
      console.log(chalk.yellow(`Function analysis skipped: ${error.message}`));
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Demo 3: Dead code detection
    console.log(chalk.bold('🪦 DEMO 3: Scanning for dead code...\n'));
    const deadCodeResults = await detectDeadCode('src/', {
      recursive: true,
      thresholdDays: 30
    });
    displayResults(deadCodeResults);

    console.log('\n' + chalk.green('✅ Demo completed successfully!'));
    console.log(chalk.gray('Try running these commands yourself:\n'));
    console.log(chalk.cyan('  code-arch file package.json'));
    console.log(chalk.cyan('  code-arch dead-code src/ --recursive'));
    console.log(chalk.cyan('  code-arch repo --top 5\n'));

  } catch (error) {
    console.error(chalk.red(`\n❌ Demo error: ${error.message}\n`));
    console.log(chalk.yellow('Make sure you run this from a git repository!'));
  }
}

runDemo();
