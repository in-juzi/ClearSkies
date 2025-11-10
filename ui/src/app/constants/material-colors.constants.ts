/**
 * Material color palette for dynamic item icon colorization
 *
 * Each material defines multiple color channels for path-level SVG colorization,
 * allowing different parts of icons (handle, blade, edge) to have distinct colors.
 */

export interface ColorChannels {
  primary: string;      // Main color (always used, fallback for all paths)
  secondary?: string;   // Secondary accent color
  handle?: string;      // Handle/grip color (for tools/weapons)
  blade?: string;       // Blade/head color (for tools/weapons)
  edge?: string;        // Edge/detail color (for highlights)
  detail?: string;      // Fine detail color (for ornaments)
}

/**
 * Material color definitions
 * Colors are hex codes for multi-channel path-level SVG colorization
 */
export const MATERIAL_COLORS: Record<string, ColorChannels> = {
  // Metals
  copper: {
    primary: '#CD7F32',   // Copper orange
    secondary: '#8B4513', // Dark copper brown
    handle: '#654321',    // Dark wood handle
    blade: '#CD7F32',     // Copper blade body
    edge: '#F4A460',      // Sandy brown edge highlight
    detail: '#D2691E'     // Chocolate detail/accent
  },
  bronze: {
    primary: '#CD853F',   // Bronze gold
    secondary: '#8B7355', // Dark bronze
    handle: '#6B4423',    // Dark brown handle
    blade: '#CD853F',     // Bronze blade body
    edge: '#DAA520',      // Goldenrod edge
    detail: '#A0826D'     // Tan detail
  },
  iron: {
    primary: '#C0C0C0',   // Silver gray
    secondary: '#696969', // Dark gray
    handle: '#8B4513',    // Brown wood handle
    blade: '#C0C0C0',     // Iron blade body
    edge: '#E8E8E8',      // Light silver edge
    detail: '#A9A9A9'     // Dark silver detail
  },
  steel: {
    primary: '#B0C4DE',   // Light steel blue
    secondary: '#4682B4', // Steel blue
    handle: '#654321',    // Dark handle
    blade: '#B0C4DE',     // Steel blade body
    edge: '#F0F8FF',      // Alice blue edge
    detail: '#708090'     // Slate gray detail
  },
  silver: {
    primary: '#E8E8E8',   // Bright silver
    secondary: '#A9A9A9', // Dark silver
    handle: '#8B7355',    // Tan handle
    blade: '#E8E8E8',     // Silver blade body
    edge: '#FFFFFF',      // White edge highlight
    detail: '#C0C0C0'     // Silver detail
  },
  gold: {
    primary: '#FFD700',   // Gold
    secondary: '#DAA520', // Goldenrod
    handle: '#8B4513',    // Rich brown handle
    blade: '#FFD700',     // Gold blade body
    edge: '#FFF8DC',      // Cornsilk edge highlight
    detail: '#B8860B'     // Dark goldenrod detail
  },
  mithril: {
    primary: '#E0E6F8',   // Mystical blue-silver
    secondary: '#9BA8D9', // Deep mithril
    handle: '#4B0082',    // Indigo handle
    blade: '#E0E6F8',     // Mithril blade body
    edge: '#F0F8FF',      // Alice blue edge
    detail: '#6A5ACD'     // Slate blue detail
  },

  // Woods
  oak: {
    primary: '#8B4513',   // Saddle brown
    secondary: '#654321', // Dark brown
    handle: '#6B4423',    // Dark oak handle
    blade: '#8B4513',     // Oak body
    edge: '#A0826D',      // Light brown edge
    detail: '#654321'     // Dark detail
  },
  willow: {
    primary: '#D2B48C',   // Tan
    secondary: '#A0826D', // Dark tan
    handle: '#BC987E',    // Dark willow handle
    blade: '#D2B48C',     // Willow body
    edge: '#F5DEB3',      // Wheat edge
    detail: '#A0826D'     // Tan detail
  },
  maple: {
    primary: '#DEB887',   // Burlywood
    secondary: '#BC987E', // Dark burlywood
    handle: '#A0826D',    // Dark maple handle
    blade: '#DEB887',     // Maple body
    edge: '#FFE4B5',      // Moccasin edge
    detail: '#BC987E'     // Dark detail
  },
  birch: {
    primary: '#F5DEB3',   // Wheat
    secondary: '#D4C4A8', // Dark wheat
    handle: '#D2B48C',    // Tan handle
    blade: '#F5DEB3',     // Birch body
    edge: '#FFFACD',      // Lemon chiffon edge
    detail: '#D4C4A8'     // Dark wheat detail
  },
  bamboo: {
    primary: '#C5E17A',   // Yellow-green
    secondary: '#8DB255', // Dark bamboo
    handle: '#8DB255',    // Dark bamboo handle
    blade: '#C5E17A',     // Bamboo body
    edge: '#E6F4B8',      // Light bamboo edge
    detail: '#6B8E23'     // Olive drab detail
  },

  // Natural materials
  leather: {
    primary: '#964B00',   // Leather brown
    secondary: '#6B3410', // Dark leather
    handle: '#6B3410',    // Dark leather handle
    blade: '#964B00',     // Leather body
    edge: '#CD853F',      // Peru edge
    detail: '#8B4513'     // Saddle brown detail
  },
  hemp: {
    primary: '#9F8170',   // Hemp beige
    secondary: '#7D6658', // Dark hemp
    handle: '#7D6658',    // Dark hemp handle
    blade: '#9F8170',     // Hemp body
    edge: '#D2B48C',      // Tan edge
    detail: '#8B7355'     // Dark tan detail
  },
  linen: {
    primary: '#FAF0E6',   // Linen white
    secondary: '#E8DCC4', // Dark linen
    handle: '#E8DCC4',    // Dark linen handle
    blade: '#FAF0E6',     // Linen body
    edge: '#FFFAF0',      // Floral white edge
    detail: '#F5DEB3'     // Wheat detail
  },
  wool: {
    primary: '#F0EAD6',   // Eggshell
    secondary: '#D4CDB4', // Dark wool
    handle: '#D4CDB4',    // Dark wool handle
    blade: '#F0EAD6',     // Wool body
    edge: '#FFFAF0',      // Floral white edge
    detail: '#E8DCC4'     // Linen detail
  },

  // Fish (for cooked variants)
  fish_raw: {
    primary: '#FFB6C1',   // Light pink (raw fish)
    secondary: '#CD5C5C', // Indian red
    handle: '#CD5C5C',    // Dark pink
    blade: '#FFB6C1',     // Light pink body
    edge: '#FFC0CB',      // Pink edge
    detail: '#DB7093'     // Pale violet red detail
  },
  fish_cooked: {
    primary: '#F4A460',   // Sandy brown (cooked)
    secondary: '#D2691E', // Chocolate
    handle: '#D2691E',    // Chocolate handle
    blade: '#F4A460',     // Sandy brown body
    edge: '#FFE4B5',      // Moccasin edge
    detail: '#CD853F'     // Peru detail
  },

  // Herbs (vibrant greens)
  herb_common: {
    primary: '#90EE90',   // Light green
    secondary: '#228B22', // Forest green
    handle: '#228B22',    // Forest green handle
    blade: '#90EE90',     // Light green body
    edge: '#98FB98',      // Pale green edge
    detail: '#2E8B57'     // Sea green detail
  },
  herb_rare: {
    primary: '#00FA9A',   // Medium spring green
    secondary: '#2E8B57', // Sea green
    handle: '#2E8B57',    // Sea green handle
    blade: '#00FA9A',     // Medium spring green body
    edge: '#7FFFD4',      // Aquamarine edge
    detail: '#3CB371'     // Medium sea green detail
  },
  herb_magical: {
    primary: '#9370DB',   // Medium purple (mystical)
    secondary: '#6A5ACD', // Slate blue
    handle: '#6A5ACD',    // Slate blue handle
    blade: '#9370DB',     // Medium purple body
    edge: '#BA55D3',      // Medium orchid edge
    detail: '#8B008B'     // Dark magenta detail
  },

  // Potions
  potion_health: {
    primary: '#DC143C',   // Crimson
    secondary: '#8B0000', // Dark red
    handle: '#8B0000',    // Dark red handle
    blade: '#DC143C',     // Crimson body
    edge: '#FF6347',      // Tomato edge
    detail: '#B22222'     // Fire brick detail
  },
  potion_mana: {
    primary: '#4169E1',   // Royal blue
    secondary: '#191970', // Midnight blue
    handle: '#191970',    // Midnight blue handle
    blade: '#4169E1',     // Royal blue body
    edge: '#6495ED',      // Cornflower blue edge
    detail: '#000080'     // Navy detail
  },
  potion_stamina: {
    primary: '#32CD32',   // Lime green
    secondary: '#228B22', // Forest green
    handle: '#228B22',    // Forest green handle
    blade: '#32CD32',     // Lime green body
    edge: '#7FFF00',      // Chartreuse edge
    detail: '#006400'     // Dark green detail
  },

  // Ore/Gems
  ore_common: {
    primary: '#A9A9A9',   // Dark gray (stone)
    secondary: '#696969', // Dim gray
    handle: '#696969',    // Dim gray handle
    blade: '#A9A9A9',     // Dark gray body
    edge: '#D3D3D3',      // Light gray edge
    detail: '#808080'     // Gray detail
  },
  gem_ruby: {
    primary: '#E0115F',   // Ruby
    secondary: '#9B111E', // Dark ruby
    handle: '#9B111E',    // Dark ruby handle
    blade: '#E0115F',     // Ruby body
    edge: '#FF1493',      // Deep pink edge
    detail: '#8B0000'     // Dark red detail
  },
  gem_sapphire: {
    primary: '#0F52BA',   // Sapphire
    secondary: '#082567', // Dark sapphire
    handle: '#082567',    // Dark sapphire handle
    blade: '#0F52BA',     // Sapphire body
    edge: '#4169E1',      // Royal blue edge
    detail: '#000080'     // Navy detail
  },
  gem_emerald: {
    primary: '#50C878',   // Emerald
    secondary: '#046307', // Dark emerald
    handle: '#046307',    // Dark emerald handle
    blade: '#50C878',     // Emerald body
    edge: '#00FA9A',      // Medium spring green edge
    detail: '#228B22'     // Forest green detail
  },

  // Generic fallbacks
  generic: {
    primary: '#FFFFFF',   // White (no tint)
    secondary: '#CCCCCC', // Light gray
    handle: '#999999',    // Gray handle
    blade: '#FFFFFF',     // White body
    edge: '#FFFFFF',      // White edge
    detail: '#CCCCCC'     // Light gray detail
  }
};

/**
 * Get color channels for a material
 * Supports automatic fallback to generic if material not found
 */
export function getMaterialColors(material: string): ColorChannels {
  const normalizedMaterial = material.toLowerCase().replace(/[^a-z_]/g, '');
  return MATERIAL_COLORS[normalizedMaterial] || MATERIAL_COLORS['generic'];
}

/**
 * Extract material name from item ID
 * Examples: 'copper_sword' -> 'copper', 'oak_log' -> 'oak'
 */
export function extractMaterialFromItemId(itemId: string): string {
  const parts = itemId.split('_');
  // First part is usually the material (copper_sword, oak_log, etc.)
  return parts[0] || 'generic';
}
