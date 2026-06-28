/**
 * Generate registries for all definition types
 *
 * Usage: npx ts-node be/scripts/generate-all-registries.ts [type]
 * Types: monsters, abilities, recipes, vendors, all
 */

import * as fs from 'fs';
import * as path from 'path';

interface RegistryConfig {
  name: string;
  definitionsDir: string;
  outputFile: string;
  typeName: string;
  typeImportPath: string;
  idField: string;
  registryClassName: string;
  flatStructure?: boolean; // If true, doesn't have a definitions subdirectory
  singular?: string; // Human singular noun for doc comments (defaults to typeName); set when typeName isn't prose-friendly (e.g. 'BiomeDefinition' -> 'biome')
}

const REGISTRY_CONFIGS: Record<string, RegistryConfig> = {
  monsters: {
    name: 'Monsters',
    definitionsDir: 'data/monsters/definitions',
    outputFile: 'data/monsters/MonsterRegistry.ts',
    typeName: 'Monster',
    typeImportPath: '@shared/types',
    idField: 'monsterId',
    registryClassName: 'MonsterRegistry'
  },
  abilities: {
    name: 'Abilities',
    definitionsDir: 'data/abilities/definitions',
    outputFile: 'data/abilities/AbilityRegistry.ts',
    typeName: 'Ability',
    typeImportPath: '@shared/types',
    idField: 'abilityId',
    registryClassName: 'AbilityRegistry'
  },
  recipes: {
    name: 'Recipes',
    definitionsDir: 'data/recipes',
    outputFile: 'data/recipes/RecipeRegistry.ts',
    typeName: 'Recipe',
    typeImportPath: '@shared/types',
    idField: 'recipeId',
    registryClassName: 'RecipeRegistry',
    flatStructure: true  // Recipes are organized in subdirectories (cooking, smithing), not definitions/
  },
  vendors: {
    name: 'Vendors',
    definitionsDir: 'data/vendors',
    outputFile: 'data/vendors/VendorRegistry.ts',
    typeName: 'Vendor',
    typeImportPath: '@shared/types',
    idField: 'vendorId',
    registryClassName: 'VendorRegistry',
    flatStructure: true  // Vendors don't have a definitions subdirectory
  },
  locations: {
    name: 'Locations',
    definitionsDir: 'data/locations/definitions',
    outputFile: 'data/locations/LocationRegistry.ts',
    typeName: 'Location',
    typeImportPath: '@shared/types',
    idField: 'locationId',
    registryClassName: 'LocationRegistry'
  },
  activities: {
    name: 'Activities',
    definitionsDir: 'data/locations/activities',
    outputFile: 'data/locations/ActivityRegistry.ts',
    typeName: 'ActivityUnion',
    typeImportPath: '@shared/types',
    idField: 'activityId',
    registryClassName: 'ActivityRegistry',
    flatStructure: true
  },
  facilities: {
    name: 'Facilities',
    definitionsDir: 'data/locations/facilities',
    outputFile: 'data/locations/FacilityRegistry.ts',
    typeName: 'Facility',
    typeImportPath: '@shared/types',
    idField: 'facilityId',
    registryClassName: 'FacilityRegistry',
    flatStructure: true
  },
  biomes: {
    name: 'Biomes',
    definitionsDir: 'data/locations/biomes',
    outputFile: 'data/locations/BiomeRegistry.ts',
    typeName: 'BiomeDefinition',
    typeImportPath: '@shared/types',
    idField: 'biomeId',
    registryClassName: 'BiomeRegistry',
    flatStructure: true,
    singular: 'biome'
  },
  dropTables: {
    name: 'DropTables',
    definitionsDir: 'data/locations/drop-tables',
    outputFile: 'data/locations/DropTableRegistry.ts',
    typeName: 'DropTable',
    typeImportPath: '@shared/types',
    idField: 'dropTableId',
    registryClassName: 'DropTableRegistry',
    flatStructure: true
  }
};

/**
 * Find all TypeScript files recursively
 */
function findTsFiles(dir: string, baseDir: string, outputDir: string): Array<{ className: string; relativePath: string; subdirectory?: string }> {
  const results: Array<{ className: string; relativePath: string; subdirectory?: string }> = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively find files in subdirectories
      const subResults = findTsFiles(fullPath, baseDir, outputDir);
      const subdirName = path.relative(baseDir, path.dirname(fullPath + '/dummy')).split(path.sep)[0];

      subResults.forEach(result => {
        results.push({
          ...result,
          subdirectory: subdirName !== '.' ? subdirName : undefined
        });
      });
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const className = path.basename(entry.name, '.ts');

      // Skip registry files to avoid circular imports
      if (className.endsWith('Registry')) {
        continue;
      }

      // The import path must be relative to the REGISTRY (output) file's
      // directory — not the definitions dir. They differ for flat registries
      // whose output sits above the definitions (e.g. ActivityRegistry lives in
      // data/locations/ but its definitions are in data/locations/activities/).
      let relativePath = path.relative(outputDir, fullPath).replace(/\\/g, '/').replace(/\.ts$/, '');
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }

      results.push({ className, relativePath });
    }
  }

  return results;
}

/**
 * Generate registry file content
 */
function generateRegistry(config: RegistryConfig, files: Array<{ className: string; relativePath: string; subdirectory?: string }>): string {
  const lines: string[] = [];
  // Human singular noun for doc comments; falls back to the type name.
  const singular = (config.singular || config.typeName).toLowerCase();

  // Header
  lines.push('/**');
  lines.push(` * ${config.name} Registry - Central registry for all ${config.name.toLowerCase()}`);
  lines.push(' * Auto-generated by scripts/generate-all-registries.ts');
  lines.push(` * Generated: ${new Date().toISOString()}`);
  lines.push(' * DO NOT EDIT MANUALLY');
  lines.push(' */');
  lines.push('');
  lines.push(`import { ${config.typeName} } from '${config.typeImportPath}';`);
  lines.push('');

  // Group by subdirectory
  const grouped = new Map<string, typeof files>();
  for (const file of files) {
    const key = file.subdirectory || '_root';
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(file);
  }

  // Imports
  for (const [subdir, groupFiles] of Array.from(grouped.entries()).sort()) {
    if (subdir !== '_root') {
      lines.push(`// ${subdir.toUpperCase()}`);
    }
    for (const file of groupFiles.sort((a, b) => a.className.localeCompare(b.className))) {
      lines.push(`import { ${file.className} } from '${file.relativePath}';`);
    }
    if (subdir !== '_root') {
      lines.push('');
    }
  }

  lines.push('');
  lines.push('/**');
  lines.push(` * Central registry for all ${config.name.toLowerCase()}`);
  lines.push(' */');
  lines.push(`export class ${config.registryClassName} {`);
  lines.push(`  private static readonly items = new Map<string, ${config.typeName}>([`);

  // Add all items to map
  const sortedFiles = files.sort((a, b) => a.className.localeCompare(b.className));
  for (const file of sortedFiles) {
    lines.push(`    [${file.className}.${config.idField}, ${file.className}],`);
  }

  lines.push('  ]);');
  lines.push('');
  lines.push('  /**');
  lines.push(`   * Get a ${singular} by ID`);
  lines.push('   */');
  lines.push(`  static get(id: string): ${config.typeName} | undefined {`);
  lines.push('    return this.items.get(id);');
  lines.push('  }');
  lines.push('');
  lines.push('  /**');
  lines.push(`   * Check if a ${singular} exists`);
  lines.push('   */');
  lines.push('  static has(id: string): boolean {');
  lines.push('    return this.items.has(id);');
  lines.push('  }');
  lines.push('');
  lines.push('  /**');
  lines.push(`   * Get all ${config.name.toLowerCase()}`);
  lines.push('   */');
  lines.push(`  static getAll(): ${config.typeName}[] {`);
  lines.push('    return Array.from(this.items.values());');
  lines.push('  }');
  lines.push('');
  lines.push('  /**');
  lines.push(`   * Get all ${singular} IDs`);
  lines.push('   */');
  lines.push('  static getAllIds(): string[] {');
  lines.push('    return Array.from(this.items.keys());');
  lines.push('  }');
  lines.push('');
  lines.push('  /**');
  lines.push(`   * Get the total number of ${config.name.toLowerCase()}`);
  lines.push('   */');
  lines.push('  static get size(): number {');
  lines.push('    return this.items.size');
  lines.push('  }');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const targetType = args[0] || 'all';

  console.log('🔄 Generating registries...\n');

  let totalGenerated = 0;

  if (targetType === 'all') {
    for (const [key, config] of Object.entries(REGISTRY_CONFIGS)) {
      console.log(`📦 Generating ${config.registryClassName}...`);

      const definitionsPath = path.join(__dirname, '..', config.definitionsDir);
      const outputPath = path.join(__dirname, '..', config.outputFile);
      const files = findTsFiles(definitionsPath, definitionsPath, path.dirname(outputPath));

      const registryContent = generateRegistry(config, files);

      fs.writeFileSync(outputPath, registryContent, 'utf8');

      console.log(`✓ Generated ${outputPath}`);
      console.log(`✓ Registry contains ${files.length} ${config.name.toLowerCase()}\n`);
      totalGenerated++;
    }
  } else if (REGISTRY_CONFIGS[targetType]) {
    const config = REGISTRY_CONFIGS[targetType];
    console.log(`📦 Generating ${config.registryClassName}...`);

    const definitionsPath = path.join(__dirname, '..', config.definitionsDir);
    const outputPath = path.join(__dirname, '..', config.outputFile);
    const files = findTsFiles(definitionsPath, definitionsPath, path.dirname(outputPath));

    const registryContent = generateRegistry(config, files);

    fs.writeFileSync(outputPath, registryContent, 'utf8');

    console.log(`✓ Generated ${outputPath}`);
    console.log(`✓ Registry contains ${files.length} ${config.name.toLowerCase()}`);
    totalGenerated++;
  } else {
    console.error(`❌ Unknown type: ${targetType}`);
    console.log('Valid types: monsters, abilities, recipes, vendors, all');
    process.exit(1);
  }

  console.log(`\n✅ Generated ${totalGenerated} registries\n`);
}

main();
