/**
 * AI Analyzer - Uses Claude to generate intelligent insights
 * This is the "magic" that turns raw git data into human insights
 */

export class AIAnalyzer {
  constructor() {
    // Using Claude API endpoint (no API key needed in this environment)
    this.apiEndpoint = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-sonnet-4-20250514';
  }

  /**
   * Analyze file history and generate insights
   */
  async analyzeFileHistory(filepath, history, metadata) {
    const prompt = this.buildFileAnalysisPrompt(filepath, history, metadata);
    
    try {
      const response = await this.callClaude(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      // Fallback to rule-based analysis if AI fails
      return this.ruleBasedAnalysis(history, metadata);
    }
  }

  /**
   * Analyze function purpose from git history
   */
  async analyzeFunctionPurpose(functionName, history, relatedCommits) {
    const prompt = `You are a code archaeologist. Analyze this function's history and explain why it exists.

Function: ${functionName}

Commit History:
${this.formatCommitHistory(relatedCommits)}

Based on the commit messages and timing, provide:
1. **Why it was created** (original purpose)
2. **Key changes** (major modifications and why)
3. **Current state** (is it still needed? any red flags?)
4. **Risk assessment** (safe to modify/delete?)

Be specific and reference commit dates/messages. Keep response under 200 words.`;

    try {
      const response = await this.callClaude(prompt);
      return response;
    } catch (error) {
      return this.generateFallbackFunctionAnalysis(functionName, relatedCommits);
    }
  }

  /**
   * Detect code smells and technical debt
   */
  async detectCodeSmells(commits) {
    const urgentCommits = commits.filter(c => 
      /fix|bug|hotfix|urgent|patch|critical/i.test(c.message)
    );

    const temporaryCommits = commits.filter(c =>
      /todo|temp|temporary|hack|workaround/i.test(c.message)
    );

    const insights = [];

    if (urgentCommits.length > 0) {
      insights.push({
        type: 'panic_driven',
        severity: 'high',
        message: `Found ${urgentCommits.length} urgent/hotfix commits`,
        commits: urgentCommits.slice(0, 3),
        suggestion: 'This code may contain rushed fixes that need review'
      });
    }

    if (temporaryCommits.length > 0) {
      insights.push({
        type: 'technical_debt',
        severity: 'medium',
        message: `Found ${temporaryCommits.length} temporary/hack commits`,
        commits: temporaryCommits.slice(0, 3),
        suggestion: 'Contains acknowledged technical debt'
      });
    }

    return insights;
  }

  /**
   * Call Claude API
   */
  async callClaude(prompt) {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');
  }

  /**
   * Build prompt for file analysis
   */
  buildFileAnalysisPrompt(filepath, history, metadata) {
    return `You are a senior software engineer analyzing legacy code. Explain why this file exists.

File: ${filepath}
Created: ${metadata.created?.date || 'Unknown'} by ${metadata.created?.author || 'Unknown'}
Last Modified: ${metadata.lastModified?.date || 'Unknown'} (${metadata.lastModified?.daysAgo || 'N/A'} days ago)

Recent Commit History:
${this.formatCommitHistory(history.slice(0, 5))}

Provide a concise analysis:
1. **Original Purpose**: Why was this file created?
2. **Evolution**: How has it changed over time?
3. **Current Status**: Is it actively maintained or legacy?
4. **Red Flags**: Any concerning patterns (rushed fixes, TODOs, hacks)?

Keep it under 150 words. Be specific, not generic.`;
  }

  /**
   * Format commit history for prompts
   */
  formatCommitHistory(commits) {
    return commits
      .map(c => `• ${c.date} (${c.hash}): ${c.message}`)
      .join('\n');
  }

  /**
   * Parse AI response into structured format
   */
  parseAnalysisResponse(response) {
    // Extract sections from response
    const sections = {
      purpose: this.extractSection(response, 'Original Purpose', 'Evolution'),
      evolution: this.extractSection(response, 'Evolution', 'Current Status'),
      status: this.extractSection(response, 'Current Status', 'Red Flags'),
      redFlags: this.extractSection(response, 'Red Flags', null)
    };

    return {
      summary: response,
      sections,
      raw: response
    };
  }

  /**
   * Extract section from markdown-style response
   */
  extractSection(text, startMarker, endMarker) {
    const startRegex = new RegExp(`\\*\\*${startMarker}\\*\\*:?(.+?)(?=\\*\\*|$)`, 's');
    const match = text.match(startRegex);
    
    if (!match) return '';
    
    let content = match[1].trim();
    
    if (endMarker) {
      const endIndex = content.indexOf(`**${endMarker}**`);
      if (endIndex > 0) {
        content = content.substring(0, endIndex).trim();
      }
    }
    
    return content;
  }

  /**
   * Fallback rule-based analysis (when AI unavailable)
   */
  ruleBasedAnalysis(history, metadata) {
    const insights = [];
    
    // Check age
    const age = metadata.created?.daysAgo || 0;
    if (age > 730) {
      insights.push('📅 Legacy code (2+ years old)');
    }

    // Check activity
    const recentActivity = metadata.lastModified?.daysAgo || 9999;
    if (recentActivity > 365) {
      insights.push('💤 Inactive (no changes in 1+ year)');
    }

    // Check commit patterns
    const urgentCommits = history.filter(c => 
      /fix|bug|hotfix/i.test(c.message)
    ).length;
    
    if (urgentCommits > 3) {
      insights.push(`🚨 High bug activity (${urgentCommits} fixes found)`);
    }

    return {
      summary: insights.join('\n'),
      sections: {},
      raw: insights.join('\n')
    };
  }

  /**
   * Generate fallback function analysis
   */
  generateFallbackFunctionAnalysis(functionName, commits) {
    if (commits.length === 0) {
      return `Function "${functionName}" has no git history available.`;
    }

    const first = commits[commits.length - 1];
    const last = commits[0];

    return `**${functionName}** was introduced in ${first.date} (${first.message}). 
Last modified ${last.date} (${last.message}). 
Total commits: ${commits.length}. 
Analysis unavailable - AI service not accessible.`;
  }
}
