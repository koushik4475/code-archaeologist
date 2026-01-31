#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { analyzeFile } from './analyzers/fileAnalyzer.js';
import { analyzeFunction } from './analyzers/functionAnalyzer.js';
import { detectDeadCode } from './analyzers/deadCodeDetector.js';
import { analyzeRepo } from './analyzers/repoAnalyzer.js';
import { displayResults } from './ui/display.js';

const program = new Command();

program
  .name('code-arch')
  .description('🏛️  AI Code Archaeologist - Understand why code exists')
  .version('1.0.0');

program
  .command('file <filepath>')
  .description('Analyze a specific file to understand its history and purpose')
  .option('-d, --depth <number>', 'Number of commits to analyze', '10')
  .option('--json', 'Output as JSON')
  .action(async (filepath, options) => {
    try {
      console.log(chalk.cyan(`\n🔍 Excavating ${filepath}...\n`));
      const results = await analyzeFile(filepath, {
        depth: parseInt(options.depth),
        includeContext: true
      });
      displayResults(results, options.json);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('function <filepath> <functionName>')
  .description('Analyze a specific function to understand why it exists')
  .option('--lines <range>', 'Line range (e.g., "10-50")')
  .action(async (filepath, functionName, options) => {
    try {
      console.log(chalk.cyan(`\n🔍 Investigating function: ${functionName}\n`));
      const results = await analyzeFunction(filepath, functionName, options);
      displayResults(results, false);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('dead-code [directory]')
  .description('Detect potentially dead or unused code')
  .option('-r, --recursive', 'Recursively scan directories')
  .option('--threshold <days>', 'Consider code dead if untouched for X days', '365')
  .action(async (directory = '.', options) => {
    try {
      console.log(chalk.cyan(`\n🪦 Scanning for dead code...\n`));
      const results = await detectDeadCode(directory, {
        recursive: options.recursive,
        thresholdDays: parseInt(options.threshold)
      });
      displayResults(results, false);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('repo')
  .description('Analyze entire repository for historical insights')
  .option('--since <date>', 'Analyze commits since date (YYYY-MM-DD)')
  .option('--top <number>', 'Show top N files by activity', '10')
  .action(async (options) => {
    try {
      console.log(chalk.cyan(`\n🏛️  Excavating repository history...\n`));
      const results = await analyzeRepo({
        since: options.since,
        topN: parseInt(options.top)
      });
      displayResults(results, false);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
