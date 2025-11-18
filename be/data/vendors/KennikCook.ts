/**
 * Cook Marta
 * A cheerful woman with flour-dusted apron and warm smile. The delicious aroma of her cooking draws tr...
 */

import { Vendor } from '@shared/types';

export const KennikCook: Vendor = {
  "vendorId": "kennik-cook",
  "name": "Cook Marta",
  "description": "A cheerful woman with flour-dusted apron and warm smile. The delicious aroma of her cooking draws travelers from across the village.",
  "greeting": "Fresh from the hearth! My fish dishes will fill your belly and restore your strength.",
  "iconPath": "assets/icons/ui/merchant.svg",
  "acceptsAllItems": true,
  "sellPriceMultiplier": 0.5,
  "stock": [
    {
      "itemId": "cooked_trout",
      "buyPrice": 35,
      "stockType": "infinite"
    },
    {
      "itemId": "cooked_salmon",
      "buyPrice": 85,
      "stockType": "infinite"
    }
  ]
} as const;
