/**
 * Mountain
 * Rocky peaks and thin air dominate this harsh highland terrain
 */

import { BiomeDefinition } from '@shared/types';

export const Mountain: BiomeDefinition = {
  "biomeId": "mountain",
  "name": "Mountain",
  "description": "Rocky peaks and thin air dominate this harsh highland terrain",
  "theme": {
    "primaryColor": "#4A4A4A",
    "secondaryColor": "#2A2A2A",
    "accentColor": "#B8B8B8"
  }
} as const;
