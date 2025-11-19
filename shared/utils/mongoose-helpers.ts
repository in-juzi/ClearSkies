/**
 * Shared Mongoose Utility Functions
 * Helper functions for working with Mongoose models and Maps
 */

/**
 * Convert Mongoose Maps to plain JavaScript objects
 * Mongoose stores quality/trait data as Map objects, but the frontend expects plain objects
 *
 * @param obj - Object potentially containing Mongoose Maps
 * @returns Object with Maps converted to plain objects
 */
export function convertMapsToObjects(obj: any): any {
  if (!obj) return obj;

  // Handle toObject() method if available
  const plainObj = obj.toObject ? obj.toObject() : { ...obj };

  // Convert any Map fields to plain objects
  for (const key in plainObj) {
    if (plainObj[key] instanceof Map) {
      plainObj[key] = Object.fromEntries(plainObj[key]);
    }
  }

  return plainObj;
}

/**
 * Convert an item instance for client consumption
 * Handles both qualities and traits Map conversion
 *
 * @param item - Item instance (possibly with Mongoose Maps)
 * @returns Plain object with Maps converted
 */
export function convertItemForClient(item: any): any {
  const plainItem = item.toObject ? item.toObject() : { ...item };

  if (plainItem.qualities instanceof Map) {
    plainItem.qualities = Object.fromEntries(plainItem.qualities);
  }

  if (plainItem.traits instanceof Map) {
    plainItem.traits = Object.fromEntries(plainItem.traits);
  }

  return plainItem;
}

/**
 * Convert an array of items for client consumption
 * Batch version of convertItemForClient
 *
 * @param items - Array of item instances
 * @returns Array of plain objects with Maps converted
 */
export function convertItemsForClient(items: any[]): any[] {
  return items.map(item => convertItemForClient(item));
}

/**
 * Safe access to Mongoose Map fields
 * Returns undefined if the field is not a Map or doesn't have the key
 *
 * @param map - Mongoose Map or plain object
 * @param key - Key to access
 * @returns Value or undefined
 */
export function getMapValue<T>(map: Map<string, T> | Record<string, T> | undefined, key: string): T | undefined {
  if (!map) return undefined;

  // Check if it's a Map with .get() method
  if (map instanceof Map || (map as any).get) {
    return (map as Map<string, T>).get(key);
  }

  // Otherwise treat as plain object
  return (map as Record<string, T>)[key];
}

/**
 * Safe set value on Mongoose Map
 * Works with both Map objects and plain objects
 *
 * @param map - Mongoose Map or plain object
 * @param key - Key to set
 * @param value - Value to set
 */
export function setMapValue<T>(map: Map<string, T> | Record<string, T>, key: string, value: T): void {
  // Check if it's a Map with .set() method
  if (map instanceof Map || (map as any).set) {
    (map as Map<string, T>).set(key, value);
  } else {
    // Otherwise treat as plain object
    (map as Record<string, T>)[key] = value;
  }
}
