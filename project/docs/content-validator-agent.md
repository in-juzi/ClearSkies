# Content Validator Agent

## Overview

The Content Validator Agent is an AI-powered autonomous tool that validates all existing game content in ClearSkies. It crawls through all content definition files and identifies broken references, inconsistencies, and data integrity issues.

## Purpose

As game content grows, it becomes increasingly difficult to manually track all the relationships between items, drop tables, activities, facilities, and locations. A single typo or forgotten reference can cause runtime errors or broken gameplay. The Content Validator Agent automates this tedious verification process.

## What It Validates

### 1. Item References
- All item IDs in drop tables exist in item definitions
- Item IDs follow proper naming conventions (lowercase with underscores)

### 2. Drop Table References
- All drop tables referenced by activities exist
- Drop tables have valid structure (weights, quantities, items)
- Weight values are positive numbers
- Quantity ranges are valid (min ≤ max)

### 3. Skill References
- All skills in activity requirements exist (woodcutting, mining, fishing, smithing, cooking)
- Skill levels are reasonable (1-99)

### 4. Quality and Trait References
- All quality IDs in item definitions exist in quality definitions
- All trait IDs in item definitions exist in trait definitions
- Quality levels (1-5) are properly defined
- Trait levels (1-3) are properly defined

### 5. Equipment References
- All equipment items have valid slot assignments
- All subtypes in activity requirements exist in item definitions
- Subtypes are consistent across similar items

### 6. Location System References
- All biome IDs referenced by locations exist
- All facility IDs in locations exist
- All activity IDs in facilities exist
- All navigation links reference existing locations

### 7. Data Integrity
- Quantity ranges are valid (min ≤ max, both positive)
- Weight values are reasonable (> 0)
- Duration values are reasonable (> 0)
- XP values are reasonable (not excessively high/low)
- Level requirements are reasonable (1-99)

### 8. Unused Content Detection
- Drop tables that are defined but never referenced
- Activities that are defined but not in any facility
- Facilities that are defined but not in any location

## Error Severity Levels

### CRITICAL - Must Fix
Breaks functionality, will cause runtime errors:
- Referenced item doesn't exist
- Referenced drop table doesn't exist
- Referenced skill doesn't exist
- Invalid quantity ranges (min > max)
- Missing required fields

**Example:**
```
[CRITICAL] Forest Clearing - Chop Oak Trees Activity
  Location: be/data/locations/activities/chop-oak.json
  Issue: Drop table 'woodcutting-oak' references item 'birch_log'
  Problem: Item 'birch_log' does not exist in item definitions
  Fix: Either create birch_log.json or remove from drop table
```

### WARNING - Should Fix
May cause issues or indicate problems:
- Unreferenced drop tables (defined but never used)
- Unreferenced activities (defined but not in any facility)
- Inconsistent subtypes (similar items with different subtypes)
- Unusual balance values (very high/low XP, weights, durations)

**Example:**
```
[WARNING] Woodcutting Pine Drop Table
  Location: be/data/locations/drop-tables/woodcutting-pine.json
  Issue: Drop table defined but never referenced by any activity
  Suggestion: Remove file or add activity using this table
```

### INFO - Nice to Fix
Best practices, doesn't break functionality:
- Missing descriptions
- Inconsistent naming conventions
- Suggested balance adjustments
- Missing atmospheric details

**Example:**
```
[INFO] Mountain Pass Location
  Location: be/data/locations/definitions/mountain-pass.json
  Issue: Missing ambient description
  Suggestion: Add atmospheric details for immersion
```

## How to Use

Simply ask Claude to validate the content:

```
"Validate all game content"

"Check for broken references in the content files"

"Run the content validator agent"
```

The agent works autonomously and will:
1. Read all content definition files
2. Build reference maps of valid IDs
3. Systematically validate each content type
4. Generate comprehensive report with fix suggestions

## Validation Workflow

### Phase 1: Load Definitions
```
Reading item definitions...
Reading quality definitions...
Reading trait definitions...
Reading drop table definitions...
Reading activity definitions...
Reading facility definitions...
Reading location definitions...
Reading biome definitions...
```

### Phase 2: Build Reference Maps
```
Building reference maps...
- Items: 24 definitions
- Qualities: 5 types
- Traits: 7 types
- Drop tables: 12 definitions
- Activities: 18 definitions
- Facilities: 8 definitions
- Locations: 4 definitions
- Biomes: 3 definitions
```

### Phase 3: Validate Content
```
Validating item definitions...
Validating quality definitions...
Validating trait definitions...
Validating drop tables...
Validating activities...
Validating facilities...
Validating locations...
Validating biomes...
```

### Phase 4: Generate Report
```
=== CLEARSKIES CONTENT VALIDATION REPORT ===

Total Files Scanned: 76
Total Errors Found: 3
Total Warnings: 2
Total Info: 1

[Detailed report with all errors grouped by severity]
```

## Report Format

The agent generates a comprehensive report with:

1. **Summary Statistics**
   - Total files scanned
   - Error counts by severity
   - Content type breakdown

2. **Critical Errors**
   - File location
   - Specific issue description
   - Why it's a problem
   - Suggested fix

3. **Warnings**
   - File location
   - Issue description
   - Potential impact
   - Suggested fix

4. **Info Items**
   - File location
   - Improvement suggestion
   - Best practice notes

5. **Validation Summary**
   - Pass/fail by content type
   - Overall health assessment

## Example Report

```
=== CLEARSKIES CONTENT VALIDATION REPORT ===

Total Files Scanned: 76
Total Errors Found: 3 critical, 2 warnings, 1 info

=== CRITICAL ERRORS (Must Fix) ===

[Items] Forest Clearing - Chop Oak Trees Activity
  Location: be/data/locations/activities/chop-oak.json
  Issue: Drop table 'woodcutting-oak' references item 'birch_log'
  Problem: Item 'birch_log' does not exist in item definitions
  Fix: Either create birch_log.json or remove from drop table

[Drop Tables] Rare Fishing Drop Table
  Location: be/data/locations/drop-tables/rare-fishing.json
  Issue: References item 'golden_trout'
  Problem: Item 'golden_trout' does not exist
  Fix: Create golden_trout.json item definition

[Activities] Mine Copper Activity
  Location: be/data/locations/activities/mine-copper.json
  Issue: References drop table 'mining-copper-rare'
  Problem: Drop table 'mining-copper-rare' does not exist
  Fix: Create mining-copper-rare.json drop table or use existing table

=== WARNINGS (Should Fix) ===

[Drop Tables] Woodcutting Pine
  Location: be/data/locations/drop-tables/woodcutting-pine.json
  Issue: Drop table defined but never referenced by any activity
  Suggestion: Remove file or add activity using this table

[Activities] Cook Bread
  Location: be/data/locations/activities/cook-bread.json
  Issue: Activity defined but not in any facility
  Suggestion: Add to appropriate facility or remove file

=== INFO (Nice to Fix) ===

[Locations] Mountain Pass
  Location: be/data/locations/definitions/mountain-pass.json
  Issue: Missing ambient description
  Suggestion: Add atmospheric details for immersion

=== STATISTICS ===

Items: 24 definitions, 0 errors
Qualities: 5 definitions, 0 errors
Traits: 7 definitions, 0 errors
Drop Tables: 12 definitions, 1 unreferenced
Activities: 18 definitions, 3 errors
Facilities: 8 definitions, 0 errors
Locations: 4 definitions, 1 info
Biomes: 3 definitions, 0 errors

=== VALIDATION SUMMARY ===

✓ All skills validated
✓ All biomes validated
✗ 3 item references broken
✗ 1 drop table reference broken
✗ 1 drop table unreferenced
✓ All facilities valid
⚠ 1 location missing description

Overall Health: 92% (3 critical, 2 warnings)
```

## Benefits

1. **Prevents Runtime Errors**
   - Catches broken references before they cause crashes
   - Validates data integrity before it reaches production

2. **Identifies Dead Code**
   - Finds unreferenced drop tables
   - Finds unreferenced activities
   - Helps keep codebase clean

3. **Ensures Consistency**
   - Validates naming conventions
   - Checks for consistent subtypes
   - Verifies all relationships

4. **Saves Development Time**
   - Automated validation (no manual checking)
   - Works in background while you code
   - Comprehensive reporting with fix suggestions

5. **Improves Content Quality**
   - Identifies balance issues
   - Suggests missing descriptions
   - Promotes best practices

## Comparison: Manual vs Agent

### Manual Validation
- ❌ 30+ minutes to check all files
- ❌ Easy to miss references
- ❌ Context switching between files
- ❌ Tedious and error-prone
- ❌ Inconsistent checking

### Agent Validation
- ✅ ~2 minutes total runtime
- ✅ Checks every reference systematically
- ✅ Autonomous (works in background)
- ✅ Comprehensive and thorough
- ✅ Repeatable and consistent

## Integration with Development Workflow

### During Development
Run validator after making content changes:
```
"I just added some new activities, validate the content"
```

### Before Commits
Validate before committing content changes:
```
"Validate content before I commit these changes"
```

### Regular Audits
Run periodic checks to maintain quality:
```
"Run a content validation audit"
```

### After Bulk Changes
Validate after major content additions:
```
"I just added 10 new items, check for any broken references"
```

## Agent Invocation

The agent is invoked using the Task tool with `subagent_type="general-purpose"`:

```
User: "Validate all game content"

Claude: [Invokes Task tool with content-validator agent]

Agent: [Works autonomously]
  - Reads all content files
  - Builds reference maps
  - Validates all relationships
  - Generates comprehensive report

Agent: [Reports back with findings]
  - Summary statistics
  - Critical errors with fixes
  - Warnings and suggestions
  - Overall health assessment
```

## Common Issues Detected

### Broken Item References
```
Drop table references 'birch_log' but item doesn't exist
→ Fix: Create birch_log.json or remove from drop table
```

### Missing Drop Tables
```
Activity references 'rare-gemstones' drop table that doesn't exist
→ Fix: Create rare-gemstones.json drop table
```

### Invalid Skill Names
```
Activity requires skill 'woodwork' (should be 'woodcutting')
→ Fix: Change to valid skill name
```

### Unreferenced Content
```
Drop table 'mining-gems' exists but no activity uses it
→ Fix: Add activity or remove unused file
```

### Invalid Data Ranges
```
Drop table has minQuantity: 5, maxQuantity: 3 (invalid)
→ Fix: Ensure min ≤ max
```

## Files Validated

The agent checks all content files:

```
be/data/items/definitions/*.json           (24 files)
be/data/items/qualities/*.json             (5 files)
be/data/items/traits/*.json                (7 files)
be/data/locations/drop-tables/*.json       (12 files)
be/data/locations/activities/*.json        (18 files)
be/data/locations/facilities/*.json        (8 files)
be/data/locations/definitions/*.json       (4 files)
be/data/locations/biomes/*.json            (3 files)
```

Total: ~81 files validated

## Future Enhancements

Potential additions to the validator:

1. **Schema Validation**
   - Validate JSON structure against schemas
   - Check for required fields

2. **Balance Analysis**
   - Flag suspiciously high/low values
   - Compare similar content for consistency

3. **Naming Convention Checks**
   - Enforce consistent naming patterns
   - Flag typos and inconsistencies

4. **Cross-Reference Analysis**
   - Track which content depends on what
   - Generate dependency graphs

5. **Performance Warnings**
   - Flag excessively complex drop tables
   - Identify potential bottlenecks

## Conclusion

The Content Validator Agent is an essential tool for maintaining content quality in ClearSkies. It catches errors early, prevents runtime issues, and keeps the game data clean and consistent. By running it regularly during development, you ensure that all content references are valid and the game data maintains integrity.
