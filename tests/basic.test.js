import { test } from 'node:test';
import assert from 'node:assert';
import { GitAnalyzer } from '../src/git/gitAnalyzer.js';

test('GitAnalyzer - getDaysAgo calculates correctly', () => {
  const analyzer = new GitAnalyzer();
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const daysAgo = analyzer.getDaysAgo(yesterday.toISOString());
  assert.strictEqual(daysAgo, 1);
});

test('GitAnalyzer - parseDiff counts changes correctly', () => {
  const analyzer = new GitAnalyzer();
  
  const diff = `diff --git a/file.js b/file.js
--- a/file.js
+++ b/file.js
@@ -1,3 +1,4 @@
+new line
 existing line
-removed line
 another line`;

  const changes = analyzer.parseDiff(diff);
  assert.strictEqual(changes.added, 1);
  assert.strictEqual(changes.removed, 1);
});

test('GitAnalyzer - parseBlame extracts commit info', () => {
  const analyzer = new GitAnalyzer();
  
  const blameOutput = `abcdef1234567890abcdef1234567890abcdef12 1 1 1
author John Doe
summary Initial commit
abcdef1234567890abcdef1234567890abcdef12 2 2 1
author Jane Smith
summary Fix bug`;

  const commits = analyzer.parseBlame(blameOutput);
  assert.strictEqual(commits.length, 2);
  assert.strictEqual(commits[0].author, 'John Doe');
  assert.strictEqual(commits[1].message, 'Fix bug');
});

test('AIAnalyzer - extractSection parses markdown correctly', async () => {
  const { AIAnalyzer } = await import('../src/ai/aiAnalyzer.js');
  const analyzer = new AIAnalyzer();
  
  const text = `**Original Purpose**: This is the purpose
Some more text
**Evolution**: This is evolution`;

  const purpose = analyzer.extractSection(text, 'Original Purpose', 'Evolution');
  assert.ok(purpose.includes('This is the purpose'));
});

test('AIAnalyzer - detectCodeSmells finds panic commits', async () => {
  const { AIAnalyzer } = await import('../src/ai/aiAnalyzer.js');
  const analyzer = new AIAnalyzer();
  
  const commits = [
    { message: 'HOTFIX: critical bug', date: '2024-01-01' },
    { message: 'Add feature', date: '2024-01-02' },
    { message: 'URGENT: fix production', date: '2024-01-03' }
  ];

  const smells = await analyzer.detectCodeSmells(commits);
  const panicSmell = smells.find(s => s.type === 'panic_driven');
  
  assert.ok(panicSmell);
  assert.strictEqual(panicSmell.commits.length, 2);
});

console.log('\n✅ All tests passed!\n');

import { categorizeFile } from '../src/analyzers/deadCodeDetector.js';

test('dead-code age categorization uses threshold boundaries', () => {
  assert.strictEqual(categorizeFile(366, 365), 'dead');
  assert.strictEqual(categorizeFile(256, 365), 'suspicious');
  assert.strictEqual(categorizeFile(255, 365), 'active');
});


import { findFunction } from '../src/analyzers/functionAnalyzer.js';

test('findFunction treats regex metacharacters in names literally', () => {
  const content = 'function foo.bar() {\\n  return 1;\\n}\\nfunction fooXbar() {\\n  return 2;\\n}';
  const found = findFunction(content, 'foo.bar');
  assert.ok(found);
  assert.equal(found.startLine, 1);
  assert.match(found.code, /return 1/);
  assert.doesNotMatch(found.code, /return 2/);
});

test('findFunction safely handles names containing regex character classes', () => {
  const content = 'const parse[input] = () => 42;';
  const found = findFunction(content, 'parse[input]');
  assert.ok(found);
  assert.equal(found.startLine, 1);
});
