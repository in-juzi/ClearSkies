#!/usr/bin/env node

/**
 * Design Token Audit Script
 * Scans component SCSS files for hardcoded values and undefined tokens
 */

const fs = require('fs');
const path = require('path');

// Patterns to search for
const patterns = {
  hardcodedHexColors: /#[0-9a-fA-F]{3,6}/g,
  hardcodedRem: /\b\d+\.?\d*rem\b/g,
  hardcodedPx: /\b\d+px\b/g,
  undefinedTokens: [
    /var\(--color-accent-gold\)/g,
    /var\(--color-border-primary\)/g,
    /var\(--color-border\)(?!-)/g, // Matches --color-border but not --color-border-*
    /var\(--shadow-overlay\)/g // This is now defined, but check usage
  ],
  purpleGradients: /linear-gradient\([^)]*#8b5cf6[^)]*\)/g,
  goldGradients: /linear-gradient\([^)]*#ffd700[^)]*\)/g
};

// Directories to scan
const componentsDir = path.join(__dirname, '../../ui/src/app/components');
const sharedDir = path.join(componentsDir, 'shared');
const gameDir = path.join(componentsDir, 'game');

// Results storage
const results = {
  hardcodedColors: [],
  hardcodedSpacing: [],
  undefinedTokens: [],
  hardcodedGradients: [],
  summary: {}
};

/**
 * Recursively scan directory for SCSS files
 */
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.scss')) {
      scanFile(filePath);
    }
  });
}

/**
 * Scan individual SCSS file
 */
function scanFile(filePath) {
  const relativePath = path.relative(componentsDir, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Check for hardcoded hex colors
  const hexMatches = content.match(patterns.hardcodedHexColors) || [];
  if (hexMatches.length > 0) {
    hexMatches.forEach(match => {
      const lineNumber = findLineNumber(content, match);
      results.hardcodedColors.push({
        file: relativePath,
        line: lineNumber,
        value: match,
        context: getLineContext(lines, lineNumber - 1)
      });
    });
  }

  // Check for hardcoded rem/px values
  const remMatches = content.match(patterns.hardcodedRem) || [];
  const pxMatches = content.match(patterns.hardcodedPx) || [];
  const spacingMatches = [...remMatches, ...pxMatches];

  if (spacingMatches.length > 0) {
    spacingMatches.forEach(match => {
      const lineNumber = findLineNumber(content, match);
      const lineContent = lines[lineNumber - 1];

      // Skip if already using design tokens
      if (lineContent.includes('var(--')) {
        return;
      }

      results.hardcodedSpacing.push({
        file: relativePath,
        line: lineNumber,
        value: match,
        context: getLineContext(lines, lineNumber - 1)
      });
    });
  }

  // Check for undefined tokens
  patterns.undefinedTokens.forEach(pattern => {
    const matches = content.match(pattern) || [];
    if (matches.length > 0) {
      matches.forEach(match => {
        const lineNumber = findLineNumber(content, match);
        results.undefinedTokens.push({
          file: relativePath,
          line: lineNumber,
          token: match,
          context: getLineContext(lines, lineNumber - 1)
        });
      });
    }
  });

  // Check for hardcoded gradients
  const purpleGradients = content.match(patterns.purpleGradients) || [];
  const goldGradients = content.match(patterns.goldGradients) || [];
  const allGradients = [...purpleGradients, ...goldGradients];

  if (allGradients.length > 0) {
    allGradients.forEach(match => {
      const lineNumber = findLineNumber(content, match);
      results.hardcodedGradients.push({
        file: relativePath,
        line: lineNumber,
        gradient: match,
        context: getLineContext(lines, lineNumber - 1)
      });
    });
  }
}

/**
 * Find line number of match in content
 */
function findLineNumber(content, searchString) {
  const index = content.indexOf(searchString);
  if (index === -1) return 0;
  return content.substring(0, index).split('\n').length;
}

/**
 * Get context around a line
 */
function getLineContext(lines, lineIndex) {
  if (lineIndex < 0 || lineIndex >= lines.length) return '';
  return lines[lineIndex].trim();
}

/**
 * Print results
 */
function printResults() {
  console.log('\n========================================');
  console.log('  DESIGN TOKEN AUDIT RESULTS');
  console.log('========================================\n');

  // Summary
  console.log('SUMMARY:');
  console.log(`  Hardcoded Colors:    ${results.hardcodedColors.length} issues`);
  console.log(`  Hardcoded Spacing:   ${results.hardcodedSpacing.length} issues`);
  console.log(`  Undefined Tokens:    ${results.undefinedTokens.length} issues`);
  console.log(`  Hardcoded Gradients: ${results.hardcodedGradients.length} issues`);
  console.log(`  TOTAL ISSUES:        ${results.hardcodedColors.length + results.hardcodedSpacing.length + results.undefinedTokens.length + results.hardcodedGradients.length}`);

  // Hardcoded Colors
  if (results.hardcodedColors.length > 0) {
    console.log('\n\n========================================');
    console.log('  HARDCODED HEX COLORS');
    console.log('========================================\n');

    const colorsByFile = groupByFile(results.hardcodedColors);
    Object.keys(colorsByFile).forEach(file => {
      console.log(`📄 ${file}`);
      colorsByFile[file].forEach(item => {
        console.log(`   Line ${item.line}: ${item.value}`);
        console.log(`   Context: ${item.context}`);
        console.log('');
      });
    });
  }

  // Hardcoded Spacing
  if (results.hardcodedSpacing.length > 0) {
    console.log('\n========================================');
    console.log('  HARDCODED SPACING (rem/px)');
    console.log('========================================\n');

    const spacingByFile = groupByFile(results.hardcodedSpacing);
    Object.keys(spacingByFile).forEach(file => {
      console.log(`📄 ${file}`);
      spacingByFile[file].forEach(item => {
        console.log(`   Line ${item.line}: ${item.value}`);
        console.log(`   Context: ${item.context}`);
        console.log('');
      });
    });
  }

  // Undefined Tokens
  if (results.undefinedTokens.length > 0) {
    console.log('\n========================================');
    console.log('  UNDEFINED TOKENS');
    console.log('========================================\n');

    const tokensByFile = groupByFile(results.undefinedTokens);
    Object.keys(tokensByFile).forEach(file => {
      console.log(`📄 ${file}`);
      tokensByFile[file].forEach(item => {
        console.log(`   Line ${item.line}: ${item.token}`);
        console.log(`   Context: ${item.context}`);
        console.log('');
      });
    });
  }

  // Hardcoded Gradients
  if (results.hardcodedGradients.length > 0) {
    console.log('\n========================================');
    console.log('  HARDCODED GRADIENTS');
    console.log('========================================\n');

    const gradientsByFile = groupByFile(results.hardcodedGradients);
    Object.keys(gradientsByFile).forEach(file => {
      console.log(`📄 ${file}`);
      gradientsByFile[file].forEach(item => {
        console.log(`   Line ${item.line}`);
        console.log(`   Gradient: ${item.gradient.substring(0, 80)}...`);
        console.log(`   Context: ${item.context}`);
        console.log('');
      });
    });
  }

  // Migration Priority
  console.log('\n========================================');
  console.log('  MIGRATION PRIORITY');
  console.log('========================================\n');

  const priorityFiles = calculatePriority();
  priorityFiles.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. ${item.file} (${item.totalIssues} issues)`);
    console.log(`   - ${item.colors} hardcoded colors`);
    console.log(`   - ${item.spacing} hardcoded spacing`);
    console.log(`   - ${item.tokens} undefined tokens`);
    console.log(`   - ${item.gradients} hardcoded gradients`);
    console.log('');
  });
}

/**
 * Group results by file
 */
function groupByFile(items) {
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.file]) {
      grouped[item.file] = [];
    }
    grouped[item.file].push(item);
  });
  return grouped;
}

/**
 * Calculate migration priority based on issue count
 */
function calculatePriority() {
  const fileIssues = {};

  // Count issues per file
  [...results.hardcodedColors, ...results.hardcodedSpacing, ...results.undefinedTokens, ...results.hardcodedGradients].forEach(item => {
    if (!fileIssues[item.file]) {
      fileIssues[item.file] = {
        file: item.file,
        colors: 0,
        spacing: 0,
        tokens: 0,
        gradients: 0,
        totalIssues: 0
      };
    }
  });

  results.hardcodedColors.forEach(item => {
    fileIssues[item.file].colors++;
    fileIssues[item.file].totalIssues++;
  });

  results.hardcodedSpacing.forEach(item => {
    fileIssues[item.file].spacing++;
    fileIssues[item.file].totalIssues++;
  });

  results.undefinedTokens.forEach(item => {
    fileIssues[item.file].tokens++;
    fileIssues[item.file].totalIssues++;
  });

  results.hardcodedGradients.forEach(item => {
    fileIssues[item.file].gradients++;
    fileIssues[item.file].totalIssues++;
  });

  // Sort by total issues descending
  return Object.values(fileIssues).sort((a, b) => b.totalIssues - a.totalIssues);
}

// Run audit
console.log('Scanning components...\n');
scanDirectory(componentsDir);
printResults();

console.log('\n========================================');
console.log('  Audit complete!');
console.log('========================================\n');
console.log('Next steps:');
console.log('1. Review migration guide: project/docs/060-design-system-v2-migration-guide.md');
console.log('2. Start with highest priority files');
console.log('3. Test changes in browser after each component migration');
console.log('');
