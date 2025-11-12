/**
 * Convert JSON item definitions to TypeScript const exports
 *
 * Usage: npx ts-node be/scripts/convert-json-to-ts.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface ConversionResult {
  filesCreated: number;
  itemsConverted: number;
  errors: string[];
}

/**
 * Convert a single JSON file containing multiple item definitions
 */
function convertJsonFile(jsonPath: string, outputBaseDir: string): ConversionResult {
  const result: ConversionResult = {
    filesCreated: 0,
    itemsConverted: 0,
    errors: []
  };

  try {
    // Read JSON file
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);

    // Get relative directory structure (e.g., "resources/wood")
    const dataPath = path.join(__dirname, '../data/items/definitions');
    const relativePath = path.relative(dataPath, path.dirname(jsonPath));

    // Create output directory
    const outputDir = path.join(outputBaseDir, relativePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Handle both object format and array format
    let items: Array<[string, any]>;
    if (Array.isArray(data)) {
      // Array format: use itemId as key
      items = data.map((item: any) => [item.itemId, item]);
    } else {
      // Object format: use object keys
      items = Object.entries(data);
    }

    // Convert each item
    for (const [key, itemData] of items) {
      try {
        const tsContent = generateTypeScriptFile(itemData as any);
        const className = toPascalCase(itemData.itemId || key);
        const outputPath = path.join(outputDir, `${className}.ts`);

        fs.writeFileSync(outputPath, tsContent, 'utf8');

        result.filesCreated++;
        result.itemsConverted++;
        console.log(`✓ Created ${relativePath}/${className}.ts`);
      } catch (error) {
        result.errors.push(`Failed to convert ${key}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } catch (error) {
    result.errors.push(`Failed to read ${jsonPath}: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

/**
 * Generate TypeScript file content for an item
 */
function generateTypeScriptFile(item: any): string {
  // Determine item type
  let itemType = 'Item';
  if (item.category === 'resource') {
    itemType = 'ResourceItem';
  } else if (item.category === 'equipment') {
    itemType = 'EquipmentItem';
  } else if (item.category === 'consumable') {
    itemType = 'ConsumableItem';
  }

  // Calculate relative import path to types
  // From be/data/items/definitions/{category}/*.ts to be/types/items.ts
  const importPath = '../../../../types/items';

  // Generate file content
  const lines: string[] = [];

  // Header comment
  lines.push('/**');
  lines.push(` * ${item.name} - ${item.description}`);
  if (item.properties?.tier) {
    lines.push(` * Tier: ${item.properties.tier}`);
  }
  lines.push(' */');
  lines.push('');

  // Import
  lines.push(`import { ${itemType} } from '${importPath}';`);
  lines.push('');

  // Export const
  const className = toPascalCase(item.itemId);
  lines.push(`export const ${className}: ${itemType} = ${JSON.stringify(item, null, 2)} as const;`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Convert snake_case or kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Recursively find all JSON files in a directory
 */
function findJsonFiles(dir: string): string[] {
  const files: string[] = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Main conversion function
 */
function main() {
  console.log('🔄 Converting JSON item definitions to TypeScript...\n');

  const inputDir = path.join(__dirname, '../data/items/definitions');
  const outputDir = path.join(__dirname, '../data/items/definitions');

  // Find all JSON files
  const jsonFiles = findJsonFiles(inputDir);
  console.log(`Found ${jsonFiles.length} JSON files\n`);

  // Convert each file
  let totalCreated = 0;
  let totalConverted = 0;
  const allErrors: string[] = [];

  for (const jsonFile of jsonFiles) {
    console.log(`Processing ${path.basename(jsonFile)}...`);
    const result = convertJsonFile(jsonFile, outputDir);

    totalCreated += result.filesCreated;
    totalConverted += result.itemsConverted;
    allErrors.push(...result.errors);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`✓ Created ${totalCreated} TypeScript files`);
  console.log(`✓ Converted ${totalConverted} items`);

  if (allErrors.length > 0) {
    console.log(`\n❌ ${allErrors.length} errors:`);
    allErrors.forEach(error => console.log(`  - ${error}`));
  } else {
    console.log('✓ No errors');
  }
  console.log('='.repeat(60));
}

// Run conversion
main();
