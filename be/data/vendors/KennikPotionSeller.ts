/**
 * Alchemist Elara
 * A mysterious woman with silver-streaked hair and stained fingers from years of brewing potions. Her ...
 */

import { Vendor } from '@shared/types';

export const KennikPotionSeller: Vendor = {
  "vendorId": "kennik-potion-seller",
  "name": "Alchemist Elara",
  "description": "A mysterious woman with silver-streaked hair and stained fingers from years of brewing potions. Her shelves are lined with bubbling vials and aromatic herbs.",
  "greeting": "Need something to mend your wounds? My potions are crafted with the finest ingredients.",
  "iconPath": "assets/icons/ui/merchant.svg",
  "acceptsAllItems": true,
  "sellPriceMultiplier": 0.5,
  "stock": [
    {
      "itemId": "health_tincture",
      "buyPrice": 75,
      "stockType": "infinite"
    }
  ]
} as const;
