#!/usr/bin/env node

/**
 * Pre-commit security check
 * Scans staged files for sensitive data like private keys, wallet addresses, seed phrases, etc.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

// Patterns to detect sensitive data
const SENSITIVE_PATTERNS = [
	// Private keys (various formats)
	{
		name: 'Private Key (Base58)',
		pattern: /[1-9A-HJ-NP-Za-km-z]{87,88}/,
		description: 'Base58 encoded private key (Solana/other)',
	},
	{
		name: 'Private Key (Hex)',
		pattern: /[0-9a-fA-F]{64}/,
		description: 'Hex encoded private key (64 chars)',
	},
	{
		name: 'Private Key (WIF)',
		pattern: /^[5KL][1-9A-HJ-NP-Za-km-z]{50,51}$/m,
		description: 'Bitcoin WIF private key',
	},
	
	// Seed phrases / Mnemonics
	{
		name: 'Seed Phrase',
		pattern: /\b(?:[a-z]+\s+){11,23}[a-z]+\b/i,
		description: 'Potential seed phrase (12-24 words)',
		excludePattern: /(?:the|and|for|are|but|not|you|all|can|her|was|one|our|out|day|get|has|him|his|how|man|new|now|old|see|two|way|who|boy|did|its|let|put|say|she|too|use)/i, // Common words that might cause false positives
	},
	
	// Suspicious file names (only check actual filenames, not content)
	{
		name: 'Suspicious Filename',
		pattern: /(poo|wallet|private|secret|seed|mnemonic|password|credential)\.(txt|key|pem|env|log)/i,
		description: 'File with suspicious name',
		checkFilename: true,
	},
	
	// Ethereum private keys (0x followed by 64 hex chars)
	{
		name: 'Ethereum Private Key',
		pattern: /0x[0-9a-fA-F]{64}(?![0-9a-fA-F])/,
		description: 'Ethereum private key',
	},
	
	// Common sensitive patterns
	{
		name: 'API Key Pattern',
		pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]?[A-Za-z0-9_-]{20,}['"]?/i,
		description: 'API key in code',
	},
	{
		name: 'Password Pattern',
		pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"]?[^\s'"]{8,}['"]?/i,
		description: 'Password in code',
	},
];

// Files/directories to ignore
const IGNORE_PATTERNS = [
	/^node_modules\//,
	/^\.git\//,
	/^dist\//,
	/^\.output\//,
	/^\.astro\//,
	/package-lock\.json$/,
	/yarn\.lock$/,
	/bun\.lockb$/,
	/\.min\.js$/,
	/\.map$/,
	/^scripts\/pre-commit-security-check\.js$/, // Don't check this file itself
];

// Known safe patterns (public contract addresses, transaction hashes, URLs, etc.)
const SAFE_PATTERNS = [
	/contractAddress/i,
	/CONTRACT_ADDRESS/i,
	/public.*address/i,
	/token.*address/i,
	/solscan\.io/i,
	/href=/i,
	/url/i,
	/transaction/i,
	/tx/i,
	/https?:\/\//i, // URLs are safe
];

function isIgnored(filename) {
	return IGNORE_PATTERNS.some(pattern => pattern.test(filename));
}

function isSafeContext(content, match, pattern) {
	// Check if the match is in a safe context (like a comment about public addresses)
	const context = content.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50);
	return SAFE_PATTERNS.some(safe => safe.test(context));
}

function checkFile(filepath) {
	const issues = [];
	
	try {
		const content = readFileSync(filepath, 'utf8');
		const filename = filepath.split('/').pop();
		
		// Skip checking content of .gitignore files (they're meant to list files)
		const isGitignore = filepath.endsWith('.gitignore');
		
		// Check filename patterns first (only on actual filename, not content)
		for (const { name, pattern, description, checkFilename } of SENSITIVE_PATTERNS) {
			if (checkFilename && pattern.test(filepath)) {
				issues.push({
					type: name,
					file: filepath,
					description: `${description} - suspicious filename detected`,
					severity: 'high',
				});
			}
		}
		
		// Skip content checks for .gitignore files
		if (isGitignore) {
			return issues;
		}
		
		// Check content patterns
		for (const { name, pattern, description, excludePattern, checkFilename } of SENSITIVE_PATTERNS) {
			// Skip filename-only patterns
			if (checkFilename) {
				continue;
			}
			
			// Check file content
			const matches = [...content.matchAll(new RegExp(pattern, 'g'))];
			for (const match of matches) {
				// Skip if excluded pattern matches
				if (excludePattern && excludePattern.test(match[0])) {
					continue;
				}
				
				// Skip if in safe context
				if (isSafeContext(content, match, pattern)) {
					continue;
				}
				
				// Skip common false positives in package.json (like "typescript-sort-keys")
				if (filepath.endsWith('package.json') && /sort-keys|plugin-/.test(match[0])) {
					continue;
				}
				
				// Get line number
				const lineNumber = content.substring(0, match.index).split('\n').length;
				const line = content.split('\n')[lineNumber - 1]?.trim() || '';
				
				issues.push({
					type: name,
					file: filepath,
					line: lineNumber,
					description: description,
					severity: name.includes('Private Key') || name.includes('Seed Phrase') ? 'high' : 'medium',
					snippet: line.substring(0, 100),
				});
			}
		}
	} catch (error) {
		// Skip binary files or files that can't be read
		if (error.code !== 'EISDIR') {
			console.warn(`${YELLOW}Warning: Could not check ${filepath}: ${error.message}${RESET}`);
		}
	}
	
	return issues;
}

function main() {
	try {
		// Get staged files
		const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', {
			encoding: 'utf8',
		})
			.trim()
			.split('\n')
			.filter(Boolean)
			.filter(file => !isIgnored(file));
		
		if (stagedFiles.length === 0) {
			return 0;
		}
		
		console.log(`${GREEN}🔒 Running security check on ${stagedFiles.length} staged file(s)...${RESET}\n`);
		
		const allIssues = [];
		
		for (const file of stagedFiles) {
			const issues = checkFile(file);
			allIssues.push(...issues);
		}
		
		if (allIssues.length === 0) {
			console.log(`${GREEN}✅ No sensitive data detected.${RESET}\n`);
			return 0;
		}
		
		// Group issues by severity
		const highSeverity = allIssues.filter(i => i.severity === 'high');
		const mediumSeverity = allIssues.filter(i => i.severity === 'medium');
		
		console.log(`${RED}❌ SECURITY ALERT: Sensitive data detected!${RESET}\n`);
		
		if (highSeverity.length > 0) {
			console.log(`${RED}HIGH SEVERITY ISSUES:${RESET}`);
			highSeverity.forEach(issue => {
				console.log(`\n  ${RED}⚠️  ${issue.type}${RESET}`);
				console.log(`     File: ${issue.file}`);
				if (issue.line) {
					console.log(`     Line: ${issue.line}`);
					if (issue.snippet) {
						console.log(`     Snippet: ${issue.snippet}...`);
					}
				}
				console.log(`     Description: ${issue.description}`);
			});
		}
		
		if (mediumSeverity.length > 0) {
			console.log(`\n${YELLOW}MEDIUM SEVERITY ISSUES:${RESET}`);
			mediumSeverity.forEach(issue => {
				console.log(`\n  ${YELLOW}⚠️  ${issue.type}${RESET}`);
				console.log(`     File: ${issue.file}`);
				if (issue.line) {
					console.log(`     Line: ${issue.line}`);
					if (issue.snippet) {
						console.log(`     Snippet: ${issue.snippet}...`);
					}
				}
				console.log(`     Description: ${issue.description}`);
			});
		}
		
		console.log(`\n${RED}🚫 Commit blocked!${RESET}`);
		console.log(`${YELLOW}Please remove sensitive data before committing.${RESET}`);
		console.log(`${YELLOW}If this is a false positive, you can bypass with: git commit --no-verify${RESET}\n`);
		
		return 1;
	} catch (error) {
		console.error(`${RED}Error running security check:${RESET}`, error.message);
		return 1;
	}
}

process.exit(main());
