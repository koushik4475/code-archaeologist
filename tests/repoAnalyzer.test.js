import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRepoHealth } from '../src/analyzers/repoAnalyzer.js';

test('change concentration uses file-change events, not commit count', () => {
  const metrics = calculateRepoHealth(
    Array.from({ length: 4 }, () => ({})),
    [],
    [{ file: 'src/a.js', commits: 5 }, { file: 'src/b.js', commits: 3 }],
    [],
    20
  );

  assert.equal(metrics.changeConcentration, '40.0');
});

test('change concentration is zero when there are no file changes', () => {
  const metrics = calculateRepoHealth([], [], [], [], 0);

  assert.equal(metrics.changeConcentration, 0);
});
