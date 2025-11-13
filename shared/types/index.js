"use strict";
/**
 * Central exports for all game type definitions
 *
 * Import from here to get all types:
 * import { Item, Monster, Location } from '../types';
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// ===== COMMON TYPES =====
__exportStar(require("./common"), exports);
// ===== ITEM TYPES =====
__exportStar(require("./items"), exports);
// ===== COMBAT TYPES =====
__exportStar(require("./combat"), exports);
// ===== LOCATION TYPES =====
__exportStar(require("./locations"), exports);
// ===== CRAFTING & VENDOR TYPES =====
__exportStar(require("./crafting"), exports);
// ===== TYPE GUARDS =====
__exportStar(require("./guards"), exports);
// ===== SHARED MODEL TYPES (FOR FRONTEND) =====
__exportStar(require("./models"), exports);
//# sourceMappingURL=index.js.map