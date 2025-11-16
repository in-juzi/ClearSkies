/**
 * Material color palette for dynamic item icon colorization
 *
 * Each material defines multiple color channels for path-level SVG colorization,
 * allowing different parts of icons (handle, blade, edge) to have distinct colors.
 */

export interface ColorChannels {
  primary: string;      // Main color (always used, fallback for all paths)
  secondary?: string;   // Secondary accent color
  tertiary?: string;    // Tertiary accent color
  quaternary?: string; // Quaternary accent color
  // Specific parts for tools/weapons
  handle?: string;      // Handle/grip color (for tools/weapons)
  guard?: string;       // Guard/crossguard color (for swords)
  blade?: string;       // Blade/head color (for tools/weapons)
  edge?: string;        // Edge/detail color (for highlights)
  detail?: string;      // Fine detail color (for ornaments)
  // Specific parts for creatures (e.g., shrimp)
  shell?: string;       // Hard carapace color
  body?: string;        // Main body segments color
  legs?: string;        // Legs and swimmerets color
  tail?: string;        // Tail color
  tailfan?: string;     // Tail fan color
  antennae?: string;    // Antennae color
  eye?: string;         // Eye color
  // Specific parts for fishing rods
  rod?: string;         // Main fishing rod pole
  rod_tip?: string;     // Rod tip section
  rod_detail?: string;  // Rod wrappings/bindings
  guide?: string;       // Line guides/eyelets
  reel?: string;        // Reel housing
  bobber?: string;      // Bobber/float
  // Specific parts for flowers
  petal?: string;       // Flower petals
  stem?: string;        // Plant stem/vine
  core?: string;        // Flower center/core
  // Specific parts for ore/crystals
  facet_light?: string; // Light facet (highlight)
  facet_mid?: string;   // Mid-tone facet
  facet_dark?: string;  // Dark facet (shadow)
  // Specific parts for logs (wood)
  end?: string;         // Cut cross-section end
  ring?: string;        // Tree rings on cross-section
  // Specific parts for gemstones (cut gems with facets)
  facet?: string;       // Gemstone facet planes
  highlight?: string;   // Bright reflections
  shadow?: string;      // Darker shaded areas
  // Specific parts for meat
  chunk?: string;       // Separate meat chunks
  marbling?: string;    // Fat marbling/veining
  bone?: string;        // Bone sections
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
  copper_sword: {
    primary: '#CD7F32',   // Copper orange (fallback)
    guard: '#8B4513',     // Dark copper guard
    blade: '#B87333',     // Rich copper blade body
    edge: '#E9967A',      // Dark salmon sharp edge
    handle: '#654321',    // Dark brown leather-wrapped handle
    detail: '#8B4513',    // Saddle brown pommel/guard details
    secondary: '#D2691E'  // Chocolate crossguard
  },
  bronze: {
    primary: '#CD853F',   // Bronze gold
    secondary: '#8B7355', // Dark bronze
    handle: '#6B4423',    // Dark brown handle
    blade: '#CD853F',     // Bronze blade body
    edge: '#DAA520',      // Goldenrod edge
    detail: '#A0826D'     // Tan detail
  },
  bronze_sword: {
    primary: '#CD853F',   // Bronze gold (fallback)
    guard: '#8B7355',     // Dark bronze guard
    blade: '#B8860B',     // Dark goldenrod blade body
    edge: '#DAA520',      // Goldenrod sharp edge
    handle: '#6B4423',    // Dark brown leather-wrapped handle
    detail: '#A0826D',    // Tan pommel/guard details
    secondary: '#8B7355'  // Dark bronze crossguard
  },
  bronze_ingot: {
    primary: '#CD853F',   // Bronze gold (main body)
    secondary: '#B8860B', // Darker golden bronze (shadows)
    edge: '#DAA520',      // Goldenrod (highlights/edges)
    detail: '#8B7355',    // Dark bronze (stamped details/marks)
    facet_light: '#F4A460', // Sandy brown (light facets)
    facet_mid: '#CD853F',   // Bronze gold (mid-tone facets)
    facet_dark: '#8B7355'   // Dark bronze (shadow facets)
  },
  iron_ingot: {
    primary: '#696969',   // Dim gray (main body) - matches iron_ore
    secondary: '#4A4A4A', // Very dark gray (shadows)
    edge: '#A9A9A9',      // Dark gray (highlights/edges)
    detail: '#808080',    // Gray (stamped details/marks)
    facet_light: '#A9A9A9', // Dark gray (light facets)
    facet_mid: '#696969',   // Dim gray (mid-tone facets)
    facet_dark: '#4A4A4A'   // Very dark gray (shadow facets)
  },
  bronze_mining_pickaxe: {
    primary: '#CD853F',   // Bronze gold (fallback)
    blade: '#CD853F',     // Bronze pick head
    handle: '#6B4423',    // Dark oak handle
    edge: '#DAA520',      // Goldenrod sharp edges
    detail: '#8B7355'     // Dark bronze detail accents
  },
  iron_mining_pickaxe: {
    primary: '#696969',   // Dim gray (fallback)
    blade: '#696969',     // Dim gray iron pick head
    handle: '#8B4513',    // Brown wood handle
    edge: '#A9A9A9',      // Dark gray sharp edges
    detail: '#4A4A4A'     // Very dark gray detail accents
  },
  bronze_woodcutting_axe: {
    primary: '#CD853F',   // Bronze gold (fallback)
    blade: '#CD853F',     // Bronze axe head
    handle: '#6B4423',    // Dark oak handle
    edge: '#DAA520',      // Goldenrod sharp edge
    detail: '#8B7355'     // Dark bronze detail accents
  },
  iron_woodcutting_axe: {
    primary: '#696969',   // Dim gray (fallback)
    blade: '#696969',     // Dim gray iron axe head
    handle: '#8B4513',    // Brown wood handle
    edge: '#A9A9A9',      // Dark gray sharp edge
    detail: '#4A4A4A'     // Very dark gray detail accents
  },
  iron: {
    primary: '#C0C0C0',   // Silver gray
    secondary: '#696969', // Dark gray
    handle: '#8B4513',    // Brown wood handle
    blade: '#C0C0C0',     // Iron blade body
    edge: '#E8E8E8',      // Light silver edge
    detail: '#A9A9A9'     // Dark silver detail
  },
  bronze_gloves: {
    primary: '#CD853F',   // Bronze gold (finger plates and palm)
    secondary: '#8B7355', // Dark bronze (wrist guards)
    edge: '#DAA520',      // Goldenrod (wrist cuff highlights)
    detail: '#A0826D'     // Tan (finger joint accents)
  },
  iron_gloves: {
    primary: '#696969',   // Dim gray (finger plates and palm)
    secondary: '#4A4A4A', // Very dark gray (wrist guards)
    edge: '#A9A9A9',      // Dark gray (wrist cuff highlights)
    detail: '#808080'     // Gray (finger joint accents)
  },
  bronze_boots: {
    primary: '#CD853F',   // Bronze gold (main boot plates)
    secondary: '#8B7355', // Dark bronze (reinforcement straps)
    edge: '#DAA520',      // Goldenrod (sole highlights)
    detail: '#A0826D'     // Tan (rivet accents)
  },
  iron_boots: {
    primary: '#696969',   // Dim gray (main boot greaves)
    secondary: '#4A4A4A', // Very dark gray (reinforcement plates)
    edge: '#A9A9A9',      // Dark gray (sole highlights)
    detail: '#808080'     // Gray (rivet accents)
  },
  bronze_helm: {
    primary: '#CD853F',   // Bronze gold (helmet dome and side panels)
    secondary: '#8B7355', // Dark bronze (cheek and neck guards)
    edge: '#DAA520',      // Goldenrod (brow band highlights)
    detail: '#A0826D'     // Tan (face opening trim and gorget)
  },
  iron_helm: {
    primary: '#696969',   // Dim gray (helmet dome and side panels)
    secondary: '#4A4A4A', // Very dark gray (cheek and neck guards)
    edge: '#A9A9A9',      // Dark gray (brow band highlights)
    detail: '#808080'     // Gray (face opening trim and gorget)
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

  // Fishing Rods (with specific channels: rod, rod_tip, rod_detail, guide, reel, handle, bobber)
  bamboo_fishing_rod: {
    primary: '#C5E17A',   // Yellow-green (fallback)
    rod: '#C5E17A',       // Yellow-green bamboo pole
    rod_tip: '#8DB255',   // Dark bamboo tip accent
    rod_detail: '#6B8E23',// Olive drab wrappings
    guide: '#C0C0C0',     // Silver line guides
    reel: '#8B7355',      // Bronze/dark tan reel housing
    handle: '#654321',    // Dark brown cork handle
    bobber: '#FF6347'     // Tomato red bobber
  },
  willow_fishing_rod: {
    primary: '#D2B48C',   // Tan (fallback)
    rod: '#D2B48C',       // Tan willow pole
    rod_tip: '#A0826D',   // Dark tan tip accent
    rod_detail: '#8B7355',// Brown wrappings
    guide: '#E8E8E8',     // Bright silver line guides
    reel: '#CD7F32',      // Copper reel housing
    handle: '#6B4423',    // Dark brown cork handle
    bobber: '#FF4500'     // Orange red bobber
  },
  yew_fishing_rod: {
    primary: '#8B4513',   // Saddle brown (fallback)
    rod: '#8B4513',       // Rich brown yew pole
    rod_tip: '#654321',   // Dark brown tip
    rod_detail: '#A0826D',// Tan leather wrappings
    guide: '#FFD700',     // Gold line guides
    reel: '#C0C0C0',      // Silver reel housing
    handle: '#2F1810',    // Very dark brown handle
    bobber: '#FFA500'     // Orange bobber
  },
  enchanted_fishing_rod: {
    primary: '#9370DB',   // Medium purple (fallback)
    rod: '#9370DB',       // Purple magical wood
    rod_tip: '#E0E6F8',   // Mystical blue-silver tip
    rod_detail: '#FFD700',// Gold magical runes
    guide: '#E0E6F8',     // Mithril line guides
    reel: '#4B0082',      // Indigo enchanted reel
    handle: '#6A5ACD',    // Slate blue magical grip
    bobber: '#00FFFF'     // Cyan glowing bobber
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

  // Fish - Raw (translucent, pink/gray tones)
  raw_fish: {
    primary: '#E8D5D5',   // Very light pinkish-gray (raw fish)
    secondary: '#C0A8A8', // Dusty pink-gray
    handle: '#C0A8A8',    // Dusty pink-gray
    blade: '#E8D5D5',     // Very light pinkish-gray body
    edge: '#F5E9E9',      // Almost white edge (translucent)
    detail: '#D4B8B8'     // Pale dusty pink detail
  },
  raw_shrimp: {
    primary: '#E0DCD8',   // Pale translucent gray (raw shrimp)
    secondary: '#B8AEA8', // Dusty gray
    shell: '#D4C8C0',     // Very pale tan shell (translucent carapace)
    body: '#E8E0D8',      // Off-white translucent body
    legs: '#F0E8E0',      // Almost white legs (very translucent)
    tail: '#D8D0C8',      // Pale gray-tan tail
    tailfan: '#C8BEB8',   // Dusty gray-tan tail fan
    antennae: '#A89E98',  // Gray-brown antennae
    eye: '#1A1A1A'        // Very dark gray-black eye
  },
  raw_trout: {
    primary: '#D5C5B8',   // Pale brown-gray (raw trout)
    secondary: '#A89888', // Dusty brown
    handle: '#A89888',    // Dusty brown
    blade: '#D5C5B8',     // Pale brown-gray body
    edge: '#E8D8C8',      // Light tan edge
    detail: '#C0B0A0'     // Tan-gray detail
  },
  raw_salmon: {
    primary: '#F4D8D0',   // Very pale peachy-pink (raw salmon)
    secondary: '#D8B0A0', // Dusty salmon
    handle: '#D8B0A0',    // Dusty salmon
    blade: '#F4D8D0',     // Very pale peachy-pink body
    edge: '#FFE8E0',      // Almost white edge
    detail: '#E0C0B0'     // Pale salmon detail
  },
  raw_cod: {
    primary: '#F0E8E0',   // Almost white (raw cod)
    secondary: '#D0C8C0', // Very pale gray
    handle: '#D0C8C0',    // Very pale gray
    blade: '#F0E8E0',     // Almost white body
    edge: '#F8F0E8',      // Pure white edge
    detail: '#E0D8D0'     // Off-white detail
  },

  // Meat - Raw (reddish-pink tones, fresh uncooked meat)
  raw_meat: {
    primary: '#C85A54',   // Deep reddish-pink (main meat body)
    body: '#C85A54',      // Main meat color (muscle tissue)
    chunk: '#B34A45',     // Slightly darker red (separate chunks)
    marbling: '#F0E6E0',  // Creamy white (fat marbling)
    edge: '#D66A64',      // Lighter red-pink (highlights/edges)
    detail: '#A03E38',    // Dark red (shadows/blood)
    bone: '#FFFFFF'       // White (bone sections)
  },

  // Fish - Cooked (opaque, warm browns/oranges)
  cooked_fish: {
    primary: '#D4A574',   // Golden brown (cooked fish)
    secondary: '#B8824C', // Dark golden brown
    handle: '#B8824C',    // Dark golden brown handle
    blade: '#D4A574',     // Golden brown body
    edge: '#E8C090',      // Light golden edge
    detail: '#A67448'     // Rich brown detail
  },
  cooked_shrimp: {
    primary: '#FF8C69',   // Coral-orange (cooked shrimp)
    secondary: '#E65C3B', // Deep coral
    shell: '#FF7F50',     // Bright coral shell
    body: '#FF9B7F',      // Light coral body
    legs: '#FFB299',      // Peachy coral legs
    tail: '#FF6347',      // Tomato red tail
    tailfan: '#E85C4A',   // Deep red-coral tail fan
    antennae: '#D9462F',  // Dark red-orange antennae
    eye: '#000000'        // Black eye
  },
  cooked_trout: {
    primary: '#D4A574',   // Golden brown (cooked trout)
    secondary: '#B8824C', // Dark golden brown
    handle: '#B8824C',    // Dark golden brown
    blade: '#D4A574',     // Golden brown body
    edge: '#E8C090',      // Light golden edge
    detail: '#A67448'     // Rich brown detail
  },
  cooked_salmon: {
    primary: '#FF9F80',   // Light salmon-orange (cooked salmon)
    secondary: '#E87560', // Deep salmon
    handle: '#E87560',    // Deep salmon handle
    blade: '#FF9F80',     // Light salmon-orange body
    edge: '#FFB89F',      // Peachy salmon edge
    detail: '#D96B50'     // Rich salmon detail
  },
  cooked_cod: {
    primary: '#F4E4D0',   // Creamy white (cooked cod)
    secondary: '#D4C4B0', // Tan-cream
    handle: '#D4C4B0',    // Tan-cream handle
    blade: '#F4E4D0',     // Creamy white body
    edge: '#FFF4E0',      // Very light cream edge
    detail: '#C4B4A0'     // Darker cream detail
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
  sage: {
    primary: '#9DC183',   // Silvery sage green (upper left leaf)
    secondary: '#7A9B76', // Darker sage (upper right leaf)
    detail: '#B8C9A8'     // Lighter silvery-green (lower left leaf)
  },
  nettle: {
    primary: '#6B8E23',   // Olive drab green (stinging leaf body)
    secondary: '#556B2F', // Dark olive green (leaf shadows/veins)
    edge: '#9ACD32',      // Yellow-green (leaf highlights/edges)
    detail: '#8FBC8F'     // Dark sea green (medicinal essence)
  },

  // Flowers
  chamomile: {
    primary: '#F5F5DC',   // Beige (fallback for white petals)
    petal: '#FFFFFF',     // Pure white petals
    stem: '#6B8E23',      // Olive drab green stem
    detail: '#F0E68C',    // Khaki outer flower layer
    core: '#FFD700'       // Golden yellow center
  },
  morning_glory: {
    primary: '#87CEEB',   // Sky blue (fallback)
    petal: '#4169E1',     // Royal blue petals
    stem: '#90EE90',      // Light green stem
    core: '#FFFACD'       // Lemon chiffon center (pale yellow)
  },
  honeysuckle: {
    primary: '#FFD700',   // Gold (fallback)
    petal: '#FFD700',     // Golden yellow petals
    stem: '#6B8E23',      // Olive drab green stem
    core: '#FF4500'       // Orange-red center
  },
  passionflower: {
    primary: '#9370DB',   // Medium purple (fallback)
    petal: '#9370DB',     // Deep purple petals
    stem: '#228B22',      // Forest green stem
    core: '#4682B4'       // Steel blue center (radiating pattern)
  },
  jasmine: {
    primary: '#FFFFFF',   // Pure white (fallback)
    petal: '#FFFFFF',     // Pure white petals
    stem: '#228B22',      // Rich green stem
    core: '#FFFACD'       // Pale yellow center
  },
  trumpet_vine: {
    primary: '#FF8C00',   // Dark orange (fallback)
    petal: '#DC143C',     // Crimson-scarlet petals
    stem: '#6B8E23',      // Olive green stem with bronze tint
    core: '#800020'       // Burgundy center
  },
  wisteria: {
    primary: '#E6E6FA',   // Lavender (fallback)
    petal: '#E6E6FA',     // Soft lavender petals
    stem: '#8FBC8F',      // Grayish-green stem
    core: '#8B008B'       // Dark magenta center
  },
  moonvine: {
    primary: '#C0C0C0',   // Silver (fallback)
    petal: '#E0F0FF',     // Silver-white with blue tint petals
    stem: '#2F4F4F',      // Deep night-blue green stem
    core: '#B0E0E6'       // Powder blue center (ethereal glow)
  },
  phoenix_vine: {
    primary: '#FF2400',   // Scarlet (fallback)
    petal: '#DC143C',     // Crimson petals
    stem: '#36454F',      // Charcoal gray with red tint stem
    core: '#FFD700'       // Molten gold center
  },

  // Potions
  health_potion: {
    primary: '#FF6B6B',    // Light coral red liquid (base layer)
    secondary: '#FF4545',  // Slightly darker red (mid-layer depth)
    detail: '#FFB6B6',     // Pale red shimmer/highlight (top layer glow)
    body: '#FFF'           // White glass bottle (container)
  },
  mana_potion: {
    primary: '#6B9BFF',    // Light blue liquid (base layer)
    secondary: '#4580FF',  // Slightly darker blue (mid-layer depth)
    detail: '#B6D4FF',     // Pale blue shimmer/highlight (top layer glow)
    body: '#FFF'           // White glass bottle (container)
  },
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
  copper_ore: {
    primary: '#CD7F32',   // Copper orange (fallback)
    body: '#B87333',      // Rich copper body
    facet_light: '#E9967A',  // Light salmon highlight
    facet_mid: '#CD7F32',    // Mid copper tone
    facet_dark: '#8B4513'    // Dark saddle brown shadow
  },
  tin_ore: {
    primary: '#A8A8A8',   // Light gray (fallback)
    body: '#C0C0C0',      // Silver gray body
    facet_light: '#E8E8E8',  // Very light silver highlight
    facet_mid: '#B8B8B8',    // Mid silver tone
    facet_dark: '#808080'    // Dark gray shadow
  },
  iron_ore: {
    primary: '#696969',   // Dim gray (fallback)
    body: '#808080',      // Gray body
    facet_light: '#A9A9A9',  // Dark gray highlight
    facet_mid: '#696969',    // Mid dim gray tone
    facet_dark: '#4A4A4A'    // Very dark gray shadow
  },
  silver_ore: {
    primary: '#C0C0C0',   // Silver (fallback)
    body: '#D3D3D3',      // Light gray body
    facet_light: '#F0F0F0',  // Very light gray highlight
    facet_mid: '#C0C0C0',    // Mid silver tone
    facet_dark: '#A9A9A9'    // Dark gray shadow
  },
  oak_log: {
    primary: '#8B4513',   // Saddle brown (fallback)
    body: '#654321',      // Dark brown bark/cylinder
    end: '#A0826D',       // Light brown cut end
    ring: '#5C4033',      // Very dark brown tree rings
    detail: '#8B4513'     // Mid saddle brown bark detail/knot
  },
  willow_log: {
    primary: '#D2B48C',   // Tan (fallback)
    body: '#BC987E',      // Dark tan bark/cylinder
    end: '#F5DEB3',       // Wheat colored cut end
    ring: '#A0826D',      // Dark tan tree rings
    detail: '#D2B48C'     // Mid tan bark detail/knot
  },
  maple_log: {
    primary: '#DEB887',   // Burlywood (fallback)
    body: '#BC987E',      // Dark burlywood bark/cylinder
    end: '#FFE4B5',       // Moccasin colored cut end
    ring: '#A0826D',      // Dark brown tree rings
    detail: '#DEB887'     // Mid burlywood bark detail/knot
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

  // Gemstones (for item_cat_jewel.svg)
  ruby: {
    primary: '#E0115F',    // Deep ruby red (main center facet)
    facet: '#C41E3A',      // Darker red facets
    highlight: '#FF6B9D',  // Pink highlights (bright reflections)
    shadow: '#8B0000',     // Dark red shadows
    edge: '#FFC0CB',       // Light pink edges
    detail: '#B22222'      // Firebrick details (inner facet lines)
  },
  emerald: {
    primary: '#50C878',    // Emerald green (main center facet)
    facet: '#2E8B57',      // Sea green facets
    highlight: '#98FB98',  // Pale green highlights
    shadow: '#006400',     // Dark green shadows
    edge: '#90EE90',       // Light green edges
    detail: '#3CB371'      // Medium sea green details
  },
  sapphire: {
    primary: '#0F52BA',    // Sapphire blue (main center facet)
    facet: '#082567',      // Dark blue facets
    highlight: '#6495ED',  // Cornflower blue highlights
    shadow: '#00008B',     // Dark blue shadows
    edge: '#87CEEB',       // Sky blue edges
    detail: '#4169E1'      // Royal blue details
  },
  quartz: {
    primary: '#F0F0F0',    // Clear white (main center facet)
    facet: '#E0E0E0',      // Light gray facets
    highlight: '#FFFFFF',  // Pure white highlights
    shadow: '#C0C0C0',     // Silver gray shadows
    edge: '#F8F8F8',       // Off-white edges
    detail: '#D3D3D3'      // Light gray details
  },
  citrine: {
    primary: '#E4D00A',    // Golden yellow (main center facet)
    facet: '#DAA520',      // Goldenrod facets
    highlight: '#FFF44F',  // Lemon yellow highlights
    shadow: '#B8860B',     // Dark goldenrod shadows
    edge: '#FFFF99',       // Light yellow edges
    detail: '#FFD700'      // Gold details
  },
  amethyst: {
    primary: '#9966CC',    // Medium purple (main center facet)
    facet: '#8B008B',      // Dark magenta facets
    highlight: '#DDA0DD',  // Plum highlights
    shadow: '#663399',     // Rebecca purple shadows
    edge: '#E6E6FA',       // Lavender edges
    detail: '#9370DB'      // Medium purple details
  },
  garnet: {
    primary: '#9B2D30',    // Deep burgundy (main center facet)
    facet: '#800020',      // Burgundy facets
    highlight: '#DC143C',  // Crimson highlights
    shadow: '#5C001A',     // Dark wine shadows
    edge: '#CC5357',       // Light burgundy edges
    detail: '#A52A2A'      // Brown red details
  },
  turquoise: {
    primary: '#40E0D0',    // Turquoise (main center facet)
    facet: '#00CED1',      // Dark turquoise facets
    highlight: '#AFEEEE',  // Pale turquoise highlights
    shadow: '#008080',     // Teal shadows
    edge: '#7FFFD4',       // Aquamarine edges
    detail: '#48D1CC'      // Medium turquoise details
  },
  topaz: {
    primary: '#FFC87C',    // Golden orange (main center facet)
    facet: '#FF7F00',      // Dark orange facets
    highlight: '#FFE4B5',  // Moccasin highlights
    shadow: '#CC7000',     // Dark golden shadows
    edge: '#FFDAB9',       // Peach puff edges
    detail: '#FFB347'      // Pastel orange details
  },
  aquamarine: {
    primary: '#7FFFD4',    // Aquamarine (main center facet)
    facet: '#66CDAA',      // Medium aquamarine facets
    highlight: '#B0E0E6',  // Powder blue highlights
    shadow: '#5F9EA0',     // Cadet blue shadows
    edge: '#AFEEEE',       // Pale turquoise edges
    detail: '#8FD8D8'      // Light cyan details
  },
  jade: {
    primary: '#00A86B',    // Jade green (main center facet)
    facet: '#007C53',      // Dark jade facets
    highlight: '#8FBC8F',  // Dark sea green highlights
    shadow: '#004D29',     // Very dark jade shadows
    edge: '#90EE90',       // Light green edges
    detail: '#2E8B57'      // Sea green details
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
