/**
 * JSON serialization utilities with circular reference detection
 */

/**
 * Safely test if an object can be JSON serialized
 * Provides detailed error information about circular references
 *
 * @param {*} obj - Object to test
 * @param {string} label - Label for logging (e.g., 'completeActivity response')
 * @returns {*} The original object if serializable
 * @throws {Error} If object contains circular references
 */
function jsonSafe(obj, label = 'object') {
  try {
    JSON.stringify(obj);
    return obj;
  } catch (e) {
    if (e.message.includes('circular')) {
      console.error(`\n========================================`);
      console.error(`[JSON Error] Circular reference detected in: ${label}`);
      console.error(`========================================`);

      if (obj && typeof obj === 'object') {
        console.error('Object keys:', Object.keys(obj));
        console.error('\nTesting each property for circular references:');

        // Try to identify which properties are problematic
        for (const [key, value] of Object.entries(obj)) {
          try {
            JSON.stringify(value);
            console.error(`  ✓ ${key}: OK`);
          } catch {
            console.error(`  ✗ ${key}: CIRCULAR REFERENCE DETECTED`);

            // Try to provide more detail about the problematic property
            if (value && typeof value === 'object') {
              console.error(`    Type: ${value.constructor?.name || 'Unknown'}`);
              console.error(`    Keys: ${Object.keys(value).slice(0, 5).join(', ')}${Object.keys(value).length > 5 ? '...' : ''}`);
            }
          }
        }
      }
      console.error(`========================================\n`);
    }
    throw e;
  }
}

/**
 * Custom JSON replacer function that handles Mongoose objects
 * Converts Maps and Mongoose schema objects to plain objects
 *
 * @param {string} key - Property key
 * @param {*} value - Property value
 * @returns {*} Sanitized value
 */
function mongooseReplacer(key, value) {
  // Convert Mongoose Maps to plain objects
  if (value && typeof value.toObject === 'function') {
    return value.toObject();
  }

  // Convert JavaScript Maps to plain objects
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  // Skip Mongoose internal properties
  if (key.startsWith('$') || key.startsWith('_')) {
    return undefined;
  }

  return value;
}

/**
 * Safely stringify an object with Mongoose handling
 *
 * @param {*} obj - Object to stringify
 * @param {number} space - Indentation spaces (default: 0)
 * @returns {string} JSON string
 */
function safeStringify(obj, space = 0) {
  return JSON.stringify(obj, mongooseReplacer, space);
}

/**
 * Deep clone and sanitize an object, removing Mongoose references
 * Useful for preparing data for API responses
 *
 * @param {*} obj - Object to sanitize
 * @returns {*} Plain object without Mongoose references
 */
function sanitize(obj) {
  return JSON.parse(JSON.stringify(obj, mongooseReplacer));
}

module.exports = {
  jsonSafe,
  mongooseReplacer,
  safeStringify,
  sanitize
};
