/**
 * Universal converter for all game definition types
 * Converts JSON files to TypeScript const exports
 *
 * Usage: npx ts-node be/scripts/convert-all-definitions.ts [type]
 * Types: monsters, abilities, recipes, vendors, locations, all
 */

import * as fs from 'fs';
import * as path from 'path';

interface DefinitionType {
  name: string;
  inputDir: string;
  outputDir: string;
  idField: string;
  typeName: string;
  importPath: string;
}

const DEFINITION_TYPES: Record<string, DefinitionType> = {
  monsters: {
    name: 'Monsters',
    inputDir: 'data/monsters/definitions',
    outputDir: 'data/monsters/definitions',
    idField: 'monsterId',
    typeName: 'Monster',
    importPath: '../../../types/combat'
  },
  abilities: {
    name: 'Abilities',
    inputDir: 'data/abilities/definitions',
    outputDir: 'data/abilities/definitions',
    idField: 'abilityId',
    typeName: 'Ability',
    importPath: '../../../types/combat'
  },
  recipes: {
    name: 'Recipes',
    inputDir: 'data/recipes',
    outputDir: 'data/recipes',
    idField: 'recipeId',
    typeName: 'Recipe',
    importPath: '../../../types/crafting'
  },
  vendors: {
    name: 'Vendors',
    inputDir: 'data/vendors',
    outputDir: 'data/vendors',
    idField: 'vendorId',
    typeName: 'Vendor',
    importPath: '../../../types/crafting'
  },
  locations: {
    name: 'Locations',
    inputDir: 'data/locations/definitions',
    outputDir: 'data/locations/definitions',
    idField: 'locationId',
    typeName: 'Location',
    importPath: '../../../types/locations'
  },
  activities: {
    name: 'Activities',
    inputDir: 'data/locations/activities',
    outputDir: 'data/locations/activities',
    idField: 'activityId',
    typeName: 'ActivityUnion',
    importPath: '../../../types/locations'
  },
  facilities: {
    name: 'Facilities',
    inputDir: 'data/locations/facilities',
    outputDir: 'data/locations/facilities',
    idField: 'facilityId',
    typeName: 'Facility',
    importPath: '../../../types/locations'
  },
  biomes: {
    name: 'Biomes',
    inputDir: 'data/locations/biomes',
    outputDir: 'data/locations/biomes',
    idField: 'biomeId',
    typeName: 'Biome',
    importPath: '../../../types/locations'
  },
  dropTables: {
    name: 'DropTables',
    inputDir: 'data/locations/drop-tables',
    outputDir: 'data/locations/drop-tables',
    idField: 'dropTableId',
    typeName: 'DropTable',
    importPath: '../../../types/locations'
  }
};

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
 * Generate TypeScript file content
 */
function generateTsFile(data: any, defType: DefinitionType): string {
  const lines: string[] = [];
  const className = toPascalCase(data[defType.idField]);

  // Header comment
  lines.push('/**');
  lines.push(` * ${data.name || className}`);
  if (data.description) {
    lines.push(` * ${data.description.slice(0, 100)}${data.description.length > 100 ? '...' : ''}`);
  }
  lines.push(' */');
  lines.push('');

  // Import
  lines.push(`import { ${defType.typeName} } from '${defType.importPath}';`);
  lines.push('');

  // Export const
  lines.push(`export const ${className}: ${defType.typeName} = ${JSON.stringify(data, null, 2)} as const;`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Convert all JSON files in a directory
 */
function convertDirectory(defType: DefinitionType): number {
  const inputPath = path.join(__dirname, '..', defType.inputDir);
  const outputPath = path.join(__dirname, '..', defType.outputDir);

  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠ Directory not found: ${inputPath}`);
    return 0;
  }

  let converted = 0;
  const files = fs.readdirSync(inputPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.json')) {
      const jsonPath = path.join(inputPath, file.name);
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

      // Handle both single object and array of objects
      const items = Array.isArray(jsonData) ? jsonData : [jsonData];

      for (const item of items) {
        const tsContent = generateTsFile(item, defType);
        const className = toPascalCase(item[defType.idField]);
        const tsPath = path.join(outputPath, `${className}.ts`);

        fs.writeFileSync(tsPath, tsContent, 'utf8');
        console.log(`✓ Created ${className}.ts`);
        converted++;
      }
    } else if (file.isDirectory()) {
      // Handle nested directories (for recipes organized by skill)
      const subInputPath = path.join(inputPath, file.name);
      const subOutputPath = path.join(outputPath, file.name);

      if (!fs.existsSync(subOutputPath)) {
        fs.mkdirSync(subOutputPath, { recursive: true });
      }

      const subFiles = fs.readdirSync(subInputPath);
      for (const subFile of subFiles) {
        if (subFile.endsWith('.json')) {
          const jsonPath = path.join(subInputPath, subFile);
          const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

          const tsContent = generateTsFile(jsonData, defType);
          const className = toPascalCase(jsonData[defType.idField]);
          const tsPath = path.join(subOutputPath, `${className}.ts`);

          fs.writeFileSync(tsPath, tsContent, 'utf8');
          console.log(`✓ Created ${file.name}/${className}.ts`);
          converted++;
        }
      }
    }
  }

  return converted;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const targetType = args[0] || 'all';

  console.log('🔄 Converting game definitions to TypeScript...\n');

  let totalConverted = 0;

  if (targetType === 'all') {
    for (const [key, defType] of Object.entries(DEFINITION_TYPES)) {
      console.log(`\n📦 Converting ${defType.name}...`);
      const count = convertDirectory(defType);
      totalConverted += count;
      console.log(`✓ Converted ${count} ${defType.name.toLowerCase()}`);
    }
  } else if (DEFINITION_TYPES[targetType]) {
    const defType = DEFINITION_TYPES[targetType];
    console.log(`📦 Converting ${defType.name}...`);
    const count = convertDirectory(defType);
    totalConverted += count;
    console.log(`✓ Converted ${count} ${defType.name.toLowerCase()}`);
  } else {
    console.error(`❌ Unknown type: ${targetType}`);
    console.log('Valid types: monsters, abilities, recipes, vendors, all');
    process.exit(1);
  }

  console.log(`\n✅ Total converted: ${totalConverted} definitions\n`);
}

main();
