/**
 * Woodsman Bjorn
 * A burly woodcutter with arms like tree trunks and a thick beard. His hands are calloused from years ...
 */

import { Vendor } from '@shared/types';

export const ForestClearingMerchant: Vendor = {
  "vendorId": "forest-clearing-merchant",
  "name": "Woodsman Bjorn",
  "description": "A burly woodcutter with arms like tree trunks and a thick beard. His hands are calloused from years of swinging axes.",
  "greeting": "Need an axe? Can't chop wood without the right tool, friend.",
  "iconPath": "assets/icons/ui/merchant.svg",
  "acceptsAllItems": true,
  "sellPriceMultiplier": 0.5,
  "stock": [
    {
      "itemId": "bronze_woodcutting_axe",
      "buyPrice": 30,
      "stockType": "infinite"
    }
  ]
} as const;
