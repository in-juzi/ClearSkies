/**
 * Herbalist Miriam
 * A gentle soul with dirt-stained fingers and a peaceful smile. She knows every plant in the realm and...
 */

import { Vendor } from '../../types/crafting';

export const KennikHerbGardenMerchant: Vendor = {
  "vendorId": "kennik-herb-garden-merchant",
  "name": "Herbalist Miriam",
  "description": "A gentle soul with dirt-stained fingers and a peaceful smile. She knows every plant in the realm and their uses.",
  "greeting": "Welcome to my garden. Seek you herbs or knowledge of the green world?",
  "iconPath": "assets/icons/ui/merchant.svg",
  "acceptsAllItems": true,
  "sellPriceMultiplier": 0.5,
  "stock": []
} as const;
