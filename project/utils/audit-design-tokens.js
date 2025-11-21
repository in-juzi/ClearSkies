#!/usr/bin/env node

/**
 * Design Token Audit Script
 * Scans component SCSS files for hardcoded values and undefined tokens
 */

const fs = require('fs');
const path = require('path');

/**
 * Load all valid design tokens from design-tokens.scss
 */
function loadValidTokens() {
  const designTokensPath = path.join(__dirname, '../../ui/src/design-tokens.scss');
  const content = fs.readFileSync(designTokensPath, 'utf-8');

  // Extract all token definitions (--token-name:)
  const tokenPattern = /--([a-z0-9-]+):/g;
  const validTokenSet = new Set();

  let match;
  while ((match = tokenPattern.exec(content)) !== null) {
    validTokenSet.add(match[1]);
  }

  return validTokenSet;
}

const validTokens = loadValidTokens();

// Patterns to search for
const patterns = {
  hardcodedHexColors: /#[0-9a-fA-F]{3,6}/g,
  hardcodedRem: /\b\d+\.?\d*rem\b/g,
  hardcodedPx: /\b\d+px\b/g,
  allTokens: /var\(--([a-z0-9-]+)\)/g, // Captures all CSS variables
  purpleGradients: /linear-gradient\([^)]*#8b5cf6[^)]*\)/g,
  goldGradients: /linear-gradient\([^)]*#ffd700[^)]*\)/g,
  // Special check for large max-height values with spacing tokens
  largeMaxHeightWithToken: /max-height:\s*var\(--spacing-[^)]+\)/g,
  // Check for width properties using non-existent spacing tokens (6xl+)
  invalidSpacingOnWidth: /(max-width|min-width|width):\s*var\(--spacing-([6-9]xl|1[0-9]xl)\)/g,
  // Check for media queries using spacing tokens
  mediaQueryWithSpacing: /@media\s*\([^)]*var\(--spacing-[^)]+\)[^)]*\)/g
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
  largeMaxHeightWithTokens: [],
  invalidSpacingOnWidth: [],
  invalidMediaQuerySpacing: [],
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

  // Check for undefined tokens by validating all CSS variables against known tokens
  const allTokenMatches = [...content.matchAll(patterns.allTokens)];
  allTokenMatches.forEach(match => {
    const fullMatch = match[0]; // var(--token-name)
    const tokenName = match[1]; // token-name

    // Check if token exists in our loaded set
    if (!validTokens.has(tokenName)) {
      const lineNumber = findLineNumber(content, fullMatch);
      results.undefinedTokens.push({
        file: relativePath,
        line: lineNumber,
        token: fullMatch,
        tokenName: tokenName,
        context: getLineContext(lines, lineNumber - 1)
      });
    }
  });

  // Check for max-height with spacing tokens (likely problematic for large values)
  const maxHeightMatches = [...content.matchAll(patterns.largeMaxHeightWithToken)];
  maxHeightMatches.forEach(match => {
    const lineNumber = findLineNumber(content, match[0]);
    const lineContent = lines[lineNumber - 1];

    results.largeMaxHeightWithTokens.push({
      file: relativePath,
      line: lineNumber,
      declaration: match[0],
      context: lineContent.trim(),
      warning: 'max-height uses spacing token - spacing tokens max out at 48px (5xl). Consider using pixel value for large constraints.'
    });
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

  // Check for invalid spacing tokens on width properties
  const invalidWidthMatches = [...content.matchAll(patterns.invalidSpacingOnWidth)];
  invalidWidthMatches.forEach(match => {
    const lineNumber = findLineNumber(content, match[0]);
    results.invalidSpacingOnWidth.push({
      file: relativePath,
      line: lineNumber,
      property: match[1], // max-width, min-width, or width
      token: match[2], // 6xl, 7xl, etc.
      fullDeclaration: match[0],
      context: getLineContext(lines, lineNumber - 1),
      suggestion: 'Use --container-* tokens for width constraints (e.g., --container-s, --container-m, --container-3xl)'
    });
  });

  // Check for media queries using spacing tokens
  const mediaQueryMatches = [...content.matchAll(patterns.mediaQueryWithSpacing)];
  mediaQueryMatches.forEach(match => {
    const lineNumber = findLineNumber(content, match[0]);
    results.invalidMediaQuerySpacing.push({
      file: relativePath,
      line: lineNumber,
      mediaQuery: match[0],
      context: getLineContext(lines, lineNumber - 1),
      suggestion: 'Use --breakpoint-* tokens for media queries (e.g., --breakpoint-mobile, --breakpoint-tablet)'
    });
  });
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
  console.log(`  Hardcoded Colors:           ${results.hardcodedColors.length} issues`);
  console.log(`  Hardcoded Spacing:          ${results.hardcodedSpacing.length} issues`);
  console.log(`  Undefined Tokens:           ${results.undefinedTokens.length} issues`);
  console.log(`  Hardcoded Gradients:        ${results.hardcodedGradients.length} issues`);
  console.log(`  max-height with tokens:     ${results.largeMaxHeightWithTokens.length} warnings`);
  console.log(`  Invalid spacing on width:   ${results.invalidSpacingOnWidth.length} issues`);
  console.log(`  Media queries with spacing: ${results.invalidMediaQuerySpacing.length} issues`);
  console.log(`  TOTAL ISSUES:               ${results.hardcodedColors.length + results.hardcodedSpacing.length + results.undefinedTokens.length + results.hardcodedGradients.length + results.largeMaxHeightWithTokens.length + results.invalidSpacingOnWidth.length + results.invalidMediaQuerySpacing.length}`);

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
    console.log('⚠️  These tokens are used but not defined in design-tokens.scss\n');

    const tokensByFile = groupByFile(results.undefinedTokens);
    Object.keys(tokensByFile).forEach(file => {
      console.log(`📄 ${file}`);
      tokensByFile[file].forEach(item => {
        console.log(`   Line ${item.line}: ${item.token}`);
        console.log(`   Token: --${item.tokenName}`);
        console.log(`   Context: ${item.context}`);
        console.log('');
      });
    });
  }

  // max-height with spacing tokens
  if (results.largeMaxHeightWithTokens.length > 0) {
    console.log('\n========================================');
    console.log('  max-height WITH SPACING TOKENS');
    console.log('========================================\n');
    console.log('⚠️  Spacing tokens max out at 48px (--spacing-5xl).');
    console.log('   Using spacing tokens for max-height constraints > 48px will fail.');
    console.log('   Consider using pixel values for component-specific height constraints.\n');

    const maxHeightByFile = groupByFile(results.largeMaxHeightWithTokens);
    Object.keys(maxHeightByFile).forEach(file => {
      console.log(`📄 ${file}`);
      maxHeightByFile[file].forEach(item => {
        console.log(`   Line ${item.line}: ${item.declaration}`);
        console.log(`   Context: ${item.context}`);
        console.log(`   ⚠️  ${item.warning}`);
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

  // Invalid Spacing on Width
  if (results.invalidSpacingOnWidth.length > 0) {
    console.log('\n========================================');
    console.log('  INVALID SPACING TOKENS ON WIDTH PROPERTIES');
    console.log('========================================\n');
    console.log('❌ Spacing tokens max out at --spacing-5xl (48px).');
    console.log('   Using --spacing-6xl+ is invalid and will fail.');
    console.log('   For width constraints, use --container-* tokens instead.\n');

    const widthByFile = groupByFile(results.invalidSpacingOnWidth);
    Object.keys(widthByFile).forEach(file => {
      console.log(`📄 ${file}`);
      widthByFile[file].forEach(item => {
        console.log(`   Line ${item.line}: ${item.fullDeclaration}`);
        console.log(`   Property: ${item.property}`);
        console.log(`   Invalid token: --spacing-${item.token}`);
        console.log(`   Context: ${item.context}`);
        console.log(`   💡 ${item.suggestion}`);
        console.log('');
      });
    });
  }

  // Invalid Media Query Spacing
  if (results.invalidMediaQuerySpacing.length > 0) {
    console.log('\n========================================');
    console.log('  MEDIA QUERIES USING SPACING TOKENS');
    console.log('========================================\n');
    console.log('⚠️  Media queries should use --breakpoint-* tokens, not --spacing-*.');
    console.log('   Available: --breakpoint-mobile (480px), --breakpoint-tablet (768px),');
    console.log('              --breakpoint-desktop (1024px), --breakpoint-wide (1440px)\n');

    const mediaByFile = groupByFile(results.invalidMediaQuerySpacing);
    Object.keys(mediaByFile).forEach(file => {
      console.log(`📄 ${file}`);
      mediaByFile[file].forEach(item => {
        console.log(`   Line ${item.line}`);
        console.log(`   Media Query: ${item.mediaQuery}`);
        console.log(`   Context: ${item.context}`);
        console.log(`   💡 ${item.suggestion}`);
        console.log('');
      });
    });
  }

  // Migration Priority
  console.log('\n========================================');
  console.log('  MIGRATION PRIORITY');
  console.log('========================================\n');

  const priorityFiles = calculatePriority();
  if (priorityFiles.length === 0) {
    console.log('✅ No issues found! All components are using design tokens correctly.\n');
  } else {
    priorityFiles.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ${item.file} (${item.totalIssues} issues)`);
      console.log(`   - ${item.colors} hardcoded colors`);
      console.log(`   - ${item.spacing} hardcoded spacing`);
      console.log(`   - ${item.tokens} undefined tokens`);
      console.log(`   - ${item.gradients} hardcoded gradients`);
      console.log(`   - ${item.maxHeightWarnings} max-height warnings`);
      console.log(`   - ${item.invalidWidthSpacing} invalid width spacing tokens`);
      console.log(`   - ${item.invalidMediaQuerySpacing} invalid media query spacing`);
      console.log('');
    });
  }
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
  [...results.hardcodedColors, ...results.hardcodedSpacing, ...results.undefinedTokens, ...results.hardcodedGradients, ...results.largeMaxHeightWithTokens, ...results.invalidSpacingOnWidth, ...results.invalidMediaQuerySpacing].forEach(item => {
    if (!fileIssues[item.file]) {
      fileIssues[item.file] = {
        file: item.file,
        colors: 0,
        spacing: 0,
        tokens: 0,
        gradients: 0,
        maxHeightWarnings: 0,
        invalidWidthSpacing: 0,
        invalidMediaQuerySpacing: 0,
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

  results.largeMaxHeightWithTokens.forEach(item => {
    fileIssues[item.file].maxHeightWarnings++;
    fileIssues[item.file].totalIssues++;
  });

  results.invalidSpacingOnWidth.forEach(item => {
    fileIssues[item.file].invalidWidthSpacing++;
    fileIssues[item.file].totalIssues++;
  });

  results.invalidMediaQuerySpacing.forEach(item => {
    fileIssues[item.file].invalidMediaQuerySpacing++;
    fileIssues[item.file].totalIssues++;
  });

  // Sort by total issues descending
  return Object.values(fileIssues).sort((a, b) => b.totalIssues - a.totalIssues);
}

// Run audit
console.log(`Loaded ${validTokens.size} design tokens from design-tokens.scss`);
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
