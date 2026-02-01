import simpleGit from 'simple-git';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';

export class GitAnalyzer {
  constructor(repoPath = '.') {
    this.repoPath = repoPath;
    this.git = simpleGit(repoPath);
  }

  /**
   * Get file history with detailed commit info
   */
  async getFileHistory(filepath, options = {}) {
    const { depth = 10, includeStats = true } = options;

    try {
      const log = await this.git.log({
        file: filepath,
        maxCount: depth
      });

      const history = [];

      for (const commit of log.all) {
        const detail = {
          hash: commit.hash.substring(0, 7),
          date: commit.date,
          author: commit.author_name,
          message: commit.message,
          body: commit.body
        };

        // Get diff stats for this commit
        if (includeStats) {
          try {
            const diff = await this.git.diff([
              `${commit.hash}~1`,
              commit.hash,
              '--',
              filepath
            ]);
            detail.changes = this.parseDiff(diff);
          } catch (error) {
            detail.changes = { added: 0, removed: 0 };
          }
        }

        history.push(detail);
      }

      return history;
    } catch (error) {
      throw new Error(`Failed to get file history: ${error.message}`);
    }
  }

  /**
   * Get creation info for a file
   */
  async getFileCreationInfo(filepath) {
    try {
      const log = await this.git.log({
        file: filepath,
        '--diff-filter': 'A'
      });

      if (log.all.length === 0) {
        return null;
      }

      const firstCommit = log.all[log.all.length - 1];
      return {
        hash: firstCommit.hash.substring(0, 7),
        date: firstCommit.date,
        author: firstCommit.author_name,
        message: firstCommit.message,
        daysAgo: this.getDaysAgo(firstCommit.date)
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get last modification info
   */
  async getLastModification(filepath) {
    try {
      const log = await this.git.log({
        file: filepath,
        maxCount: 1
      });

      if (log.all.length === 0) {
        return null;
      }

      const lastCommit = log.all[0];
      return {
        hash: lastCommit.hash.substring(0, 7),
        date: lastCommit.date,
        author: lastCommit.author_name,
        message: lastCommit.message,
        daysAgo: this.getDaysAgo(lastCommit.date)
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get blame information for specific lines
   */
  async getBlame(filepath, startLine, endLine) {
    try {
      const blameResult = await this.git.raw([
        'blame',
        '-L',
        `${startLine},${endLine}`,
        '--line-porcelain',
        filepath
      ]);

      return this.parseBlame(blameResult);
    } catch (error) {
      return [];
    }
  }

  /**
   * Search commit messages for keywords
   */
  async searchCommits(filepath, keywords = ['fix', 'bug', 'hotfix', 'urgent', 'hack', 'todo', 'temporary']) {
    const history = await this.getFileHistory(filepath, { depth: 50 });
    
    return history.filter(commit => {
      const searchText = `${commit.message} ${commit.body}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  }

  /**
   * Get related files changed in same commits
   */
  async getRelatedFiles(filepath, limit = 5) {
    try {
      const history = await this.getFileHistory(filepath, { depth: 20 });
      const relatedFiles = new Map();

      for (const commit of history) {
        const files = await this.git.diff([
          `${commit.hash}~1`,
          commit.hash,
          '--name-only'
        ]);

        const fileList = files.split('\n').filter(f => f && f !== filepath);
        fileList.forEach(file => {
          relatedFiles.set(file, (relatedFiles.get(file) || 0) + 1);
        });
      }

      return Array.from(relatedFiles.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([file, count]) => ({ file, commits: count }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Parse diff output to extract change stats
   */
  parseDiff(diff) {
    const lines = diff.split('\n');
    let added = 0;
    let removed = 0;

    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) added++;
      if (line.startsWith('-') && !line.startsWith('---')) removed++;
    }

    return { added, removed };
  }

  /**
   * Parse git blame output
   */
  parseBlame(blameOutput) {
    const lines = blameOutput.split('\n');
    const commits = [];
    let currentCommit = {};

    for (const line of lines) {
      if (line.match(/^[a-f0-9]{40}/)) {
        if (currentCommit.hash) {
          commits.push(currentCommit);
        }
        currentCommit = { hash: line.substring(0, 7) };
      } else if (line.startsWith('author ')) {
        currentCommit.author = line.substring(7);
      } else if (line.startsWith('summary ')) {
        currentCommit.message = line.substring(8);
      }
    }

    if (currentCommit.hash) {
      commits.push(currentCommit);
    }

    return commits;
  }

  /**
   * Calculate days ago from date string
   */
  getDaysAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    // Use floor to avoid small millisecond/tz differences causing off-by-one
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if file exists in git
   */
  async fileExistsInGit(filepath) {
    try {
      await this.git.raw(['ls-files', '--error-unmatch', filepath]);
      return true;
    } catch (error) {
      return false;
    }
  }
}
