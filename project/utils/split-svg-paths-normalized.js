#!/usr/bin/env node

/**
 * SVG Path Splitter with Normalization
 *
 * Splits single-path SVG icons into multiple paths based on M (move) commands.
 * Automatically converts relative coordinates to absolute before splitting to
 * ensure correct rendering.
 *
 * Requires: npm install svgpath
 *
 * Usage:
 *   node split-svg-paths-normalized.js <input.svg> [output.svg]
 *
 * Example:
 *   node split-svg-paths-normalized.js item_cat_sword.svg item_cat_sword_SPLIT.svg
 *
 * Note: This script only performs mechanical splitting. You must manually:
 * 1. Review the generated SVG
 * 2. Identify what each path represents
 * 3. Add appropriate data-channel attributes
 * 4. Update comments with semantic descriptions
 */

const fs = require('fs');
const path = require('path');

// Check if svgpath is installed
let svgpath;
try {
    svgpath = require('svgpath');
} catch (err) {
    console.error('\n❌ Error: svgpath package not found');
    console.error('   Please install it with: npm install svgpath\n');
    process.exit(1);
}

function splitSvgPaths(inputFile, outputFile) {
    console.log(`\nReading: ${inputFile}`);

    const svgContent = fs.readFileSync(inputFile, 'utf-8');

    // Match path elements with their d attribute
    // This regex captures: opening tag attributes, d attribute content, closing tag attributes
    const pathRegex = /<path([^>]*?)d="([^"]+)"([^>]*?)\/>/g;

    let newSvg = svgContent;
    let totalSubpaths = 0;
    let pathsProcessed = 0;

    newSvg = newSvg.replace(pathRegex, (match, before, dAttr, after) => {
        // Don't split the background rectangle or other simple paths
        if (dAttr.includes('M0 0h512v512H0z') || dAttr.match(/^M0 0[hHvV]/)) {
            return match;
        }

        pathsProcessed++;

        // Convert path to absolute coordinates first
        let normalizedPath;
        try {
            normalizedPath = svgpath(dAttr)
                .abs()      // Convert to absolute coordinates
                .round(3)   // Round to 3 decimal places for cleaner output
                .toString();
        } catch (err) {
            console.error(`\n⚠️  Warning: Failed to normalize path ${pathsProcessed}`);
            console.error(`   Error: ${err.message}`);
            console.error(`   Using original path data (may not split correctly)\n`);
            normalizedPath = dAttr;
        }

        // Split by M command (start of new subpath)
        // Use positive lookahead to keep M with each subpath
        const subpaths = normalizedPath.split(/(?=M)/).filter(s => s.trim());

        if (subpaths.length <= 1) {
            return match; // No splitting needed
        }

        totalSubpaths += subpaths.length;

        // Create separate path elements
        const splitPaths = subpaths.map((subpath, i) => {
            return `\n    <!-- Subpath ${i + 1} -->\n    <path${before}d="${subpath.trim()}"${after}/>`;
        }).join('');

        return splitPaths;
    });

    fs.writeFileSync(outputFile, newSvg);

    console.log(`✓ Processed ${pathsProcessed} path(s)`);
    console.log(`✓ Split into ${totalSubpaths} subpath(s)`);
    console.log(`✓ Converted to absolute coordinates`);
    console.log(`✓ Written to: ${outputFile}`);
    console.log(`\nNext steps:`);
    console.log(`1. Open ${outputFile} in a browser to verify it looks correct`);
    console.log(`2. Open ${outputFile} in a text editor`);
    console.log(`3. Add data-channel attributes (e.g., data-channel="blade")`);
    console.log(`4. Update comments with semantic descriptions\n`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
SVG Path Splitter with Normalization
-------------------------------------
Splits single-path SVG icons into multiple paths and converts to absolute coordinates.

Usage:
  node split-svg-paths-normalized.js <input.svg> [output.svg]

Arguments:
  input.svg   Path to the source SVG file
  output.svg  Path for the output file (optional)
              Default: <input>_SPLIT.svg

Examples:
  node split-svg-paths-normalized.js item_cat_sword.svg
  node split-svg-paths-normalized.js item_cat_sword.svg item_cat_sword_channels.svg

Options:
  --help, -h  Show this help message

Requirements:
  npm install svgpath
`);
    process.exit(0);
}

const inputFile = args[0];

if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
}

const outputFile = args[1] || inputFile.replace('.svg', '_SPLIT.svg');

try {
    splitSvgPaths(inputFile, outputFile);
} catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
}
