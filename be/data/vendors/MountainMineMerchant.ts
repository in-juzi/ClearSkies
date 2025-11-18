/**
 * Miner Gerta
 * A grizzled miner with hands stained black from coal dust. Her sharp eyes can spot a valuable vein fr...
 */

import { Vendor } from '@shared/types';

export const MountainMineMerchant: Vendor = {
  "vendorId": "mountain-mine-merchant",
  "name": "Miner Gerta",
  "description": "A grizzled miner with hands stained black from coal dust. Her sharp eyes can spot a valuable vein from across the cavern.",
  "greeting": "Ready to strike the earth? You'll need a proper pickaxe for that.",
  "iconPath": "assets/icons/ui/merchant.svg",
  "acceptsAllItems": true,
  "sellPriceMultiplier": 0.5,
  "stock": [
    {
      "itemId": "bronze_mining_pickaxe",
      "buyPrice": 30,
      "stockType": "infinite"
    }
  ]
} as const;
