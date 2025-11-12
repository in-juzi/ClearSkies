/**
 * Forest
 * Dense trees and dappled sunlight create a peaceful woodland environment
 */

import { BiomeDefinition } from '../../../types/locations';

export const Forest: BiomeDefinition = {
  "biomeId": "forest",
  "name": "Forest",
  "description": "Dense trees and dappled sunlight create a peaceful woodland environment",
  "theme": {
    "primaryColor": "#2D5016",
    "secondaryColor": "#1A3010",
    "accentColor": "#7CB342"
  }
} as const;
