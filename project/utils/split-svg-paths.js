#!/usr/bin/env node

/**
 * SVG Path Splitter
 *
 * Splits single-path SVG icons into multiple paths based on M (move) commands.
 * This creates separate path elements for each subpath, making it easier to
 * assign semantic data-channel attributes for dynamic styling.
 *
 * Usage:
 *   node split-svg-paths.js <input.svg> [output.svg]
 *
 * Example:
 *   node split-svg-paths.js item_cat_axe.svg item_cat_axe_SPLIT.svg
 *
 * Note: This script only performs mechanical splitting. You must manually:
 * 1. Review the generated SVG
 * 2. Identify what each path represents
 * 3. Add appropriate data-channel attributes
 * 4. Update comments with semantic descriptions
 */

const fs = require('fs');
const path = require('path');

function splitSvgPaths(inputFile, outputFile) {
    console.log(`\nReading: ${inputFile}`);

    const svgContent = fs.readFileSync(inputFile, 'utf-8');

    // Match path elements with their d attribute
    // This regex captures: opening tag attributes, d attribute content, closing tag attributes
    const pathRegex = /<path([^>]*?)d="([^"]+)"([^>]*?)\/>/g;

    let newSvg = svgContent;
    let totalSubpaths = 0;

    newSvg = newSvg.replace(pathRegex, (match, before, dAttr, after) => {
        // Don't split the background rectangle or other simple paths
        if (dAttr.includes('M0 0h512v512H0z') || dAttr.match(/^M0 0[hHvV]/)) {
            return match;
        }

        // Split by M command (start of new subpath)
        // Use positive lookahead to keep M with each subpath
        const subpaths = dAttr.split(/(?=M)/).filter(s => s.trim());

        if (subpaths.length <= 1) {
            return match; // No splitting needed
        }

        totalSubpaths = subpaths.length;

        // Create separate path elements
        const splitPaths = subpaths.map((subpath, i) => {
            return `\n    <!-- Subpath ${i + 1} -->\n    <path${before}d="${subpath.trim()}"${after}/>`;
        }).join('');

        return splitPaths;
    });

    fs.writeFileSync(outputFile, newSvg);
    console.log(`✓ Split ${totalSubpaths} subpaths`);
    console.log(`✓ Written to: ${outputFile}`);
    console.log(`\nNext steps:`);
    console.log(`1. Open ${outputFile} in a text editor`);
    console.log(`2. Review each subpath and identify what it represents`);
    console.log(`3. Add data-channel attributes (e.g., data-channel="blade")`);
    console.log(`4. Update comments with semantic descriptions\n`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
SVG Path Splitter
-----------------
Splits single-path SVG icons into multiple paths.

Usage:
  node split-svg-paths.js <input.svg> [output.svg]

Arguments:
  input.svg   Path to the source SVG file
  output.svg  Path for the output file (optional)
              Default: <input>_SPLIT.svg

Examples:
  node split-svg-paths.js item_cat_axe.svg
  node split-svg-paths.js item_cat_axe.svg item_cat_axe_channels.svg

Options:
  --help, -h  Show this help message
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
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
