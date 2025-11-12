/**
 * Validation result from definition validation
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Result from loading definitions
 */
export interface LoadResult {
  loaded: number;
  errors: LoadError[];
  warnings?: string[];
}

/**
 * Error that occurred during loading
 */
export interface LoadError {
  file: string;
  errors: string[];
}

/**
 * Options for definition loading
 */
export interface LoadOptions {
  recursive?: boolean;
  validateReferences?: boolean;
  strict?: boolean; // If true, throw on first error. If false, collect all errors
}
