#!/usr/bin/env python3
"""
Update all item definition files to use CATEGORY constants from item-constants.ts
"""

import os
import re
from pathlib import Path

# Base directory
BASE_DIR = Path(r"c:\Users\trace\OneDrive\Documents\Projects\ClearSkies\be\data\items\definitions")

# Category mappings
CATEGORY_MAPPINGS = {
    'consumable': 'CATEGORY.CONSUMABLE',
    'equipment': 'CATEGORY.EQUIPMENT',
    'resource': 'CATEGORY.RESOURCE',
}

def update_file(file_path, category_type):
    """Update a single TypeScript file to use CATEGORY constant"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already using CATEGORY constant
    if 'CATEGORY.CONSUMABLE' in content or 'CATEGORY.EQUIPMENT' in content or 'CATEGORY.RESOURCE' in content:
        return False  # Already updated

    # Step 1: Add CATEGORY to import statement if not already there
    # Find the import line for item-constants
    import_pattern = r"(import\s*\{)([^}]+)(\}\s*from\s*['\"]\.\.\/\.\.\/\.\.\/constants\/item-constants['\"];?)"

    def add_category_to_import(match):
        prefix = match.group(1)
        imports = match.group(2)
        suffix = match.group(3)

        # Split imports and clean
        import_list = [imp.strip() for imp in imports.split(',')]

        # Add CATEGORY if not present
        if 'CATEGORY' not in import_list:
            import_list.insert(0, 'CATEGORY')

        # Rejoin
        new_imports = ', '.join(import_list)
        return f"{prefix} {new_imports} {suffix}"

    content = re.sub(import_pattern, add_category_to_import, content)

    # Step 2: Replace category string with CATEGORY constant
    category_pattern = r'"category":\s*"(' + '|'.join(CATEGORY_MAPPINGS.keys()) + r'")'

    def replace_category(match):
        cat_value = match.group(1).rstrip('"')
        return f'"category": {CATEGORY_MAPPINGS[cat_value]}'

    content = re.sub(category_pattern, replace_category, content)

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True  # Updated

def main():
    stats = {
        'consumable': 0,
        'equipment': 0,
        'resource': 0,
        'total': 0,
    }

    # Process consumables
    consumables_dir = BASE_DIR / 'consumables'
    for file_path in consumables_dir.glob('*.ts'):
        if update_file(file_path, 'consumable'):
            stats['consumable'] += 1
            stats['total'] += 1

    # Process equipment
    equipment_dir = BASE_DIR / 'equipment'
    for file_path in equipment_dir.glob('*.ts'):
        if update_file(file_path, 'equipment'):
            stats['equipment'] += 1
            stats['total'] += 1

    # Process resources (need to check if consumable or resource)
    resources_dir = BASE_DIR / 'resources'
    for file_path in resources_dir.glob('*.ts'):
        # Read file to determine category
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check which category it uses
        if '"category": "consumable"' in content or 'CATEGORY.CONSUMABLE' in content:
            if update_file(file_path, 'consumable'):
                stats['consumable'] += 1
                stats['total'] += 1
        elif '"category": "resource"' in content or 'CATEGORY.RESOURCE' in content:
            if update_file(file_path, 'resource'):
                stats['resource'] += 1
                stats['total'] += 1

    print(f"\n=== Update Complete ===")
    print(f"Total files updated: {stats['total']}")
    print(f"  - Consumables: {stats['consumable']} files")
    print(f"  - Equipment: {stats['equipment']} files")
    print(f"  - Resources: {stats['resource']} files")

if __name__ == '__main__':
    main()
