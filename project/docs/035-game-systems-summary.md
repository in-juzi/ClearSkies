# Game Systems Summary

Quick reference for major game systems. For detailed documentation, see individual system files.

## Chat System

Real-time Socket.io-based player communication

**Features:**
- Global chat room with message persistence
- Command system (`/help`, `/online`, `/clear`) with autocomplete
- Rate limiting (5 messages per 10 seconds)
- JWT authentication required

**Key Files:**
- Backend: [chatHandler.js](../../be/sockets/chatHandler.js)
- Frontend: [chat.service.ts](../../ui/src/app/services/chat.service.ts), [chat.component.ts](../../ui/src/app/components/game/chat/chat.component.ts)

**Socket Events:**
- `chat:sendMessage`, `chat:message`, `chat:getHistory`, `chat:getOnlineCount`

## Socket.io Real-Time Architecture

Bidirectional real-time communication replacing HTTP polling

**Key Features:**
- Server-authoritative timing (prevents client manipulation)
- Client-driven auto-restart (requires active player, prevents AFK grinding)
- Activity overwriting (seamless action transitions)
- Reconnection handling (restores state after disconnect)

**Systems Using Socket.io:**
- Activities (gathering/combat encounters)
- Crafting (recipe creation)
- Combat (turn-based battles)
- Chat (player communication)

**Performance Impact:**
- Eliminated 1000+ HTTP requests per minute
- 99% reduction in network operations
- Instant feedback instead of polling delays

**Full Documentation:** [socketio-architecture.md](socketio-architecture.md)

## Vendor/NPC Trading System

Buy tools and sell resources at gathering locations

**Features:**
- Infinite vendor stock (architecture supports limited)
- Buy prices: Fixed per vendor definition
- Sell prices: 50% of vendor price (base + quality/trait bonuses)
- Drag-and-drop selling from inventory

**Key Files:**
- Vendor Service: [vendorService.ts](../../be/services/vendorService.ts)
- Vendor Registry: [VendorRegistry.ts](../../be/data/vendors/VendorRegistry.ts)
- Vendor Controller: [vendorController.js](../../be/controllers/vendorController.js)
- Vendor Component: [vendor.component.ts](../../ui/src/app/components/game/vendor/vendor.component.ts)

**Configuration:**
- Vendor definitions: `be/data/vendors/{VendorId}.ts`
- Link to facility via `vendorIds` array in facility definition

## Cooking/Crafting System

Create items from ingredients with quality inheritance

**Features:**
- Real-time Socket.io (server-authoritative timing, no HTTP polling)
- Instance selection (choose specific items by quality/traits)
- Quality inheritance (max ingredient quality + skill bonus)
- Auto-restart (client-driven, requires active player)
- Recipe filtering (search, craftable only, sort by level/name/XP)
- Subcategory ingredients ("any herb" instead of specific itemIds)
- Recipe unlock system (progressive discovery via achievements)

**Current Skills:**
- Cooking (4 recipes: shrimp, trout, salmon, cod)
- Smithing (16 recipes: ore smelting, bronze/iron equipment)
- Alchemy (6 recipes: health/mana potions levels 1-15)

**Key Files:**
- Recipe Service: [recipeService.ts](../../be/services/recipeService.ts)
- Recipe Registry: [RecipeRegistry.ts](../../be/data/recipes/RecipeRegistry.ts)
- Crafting Handler: [craftingHandler.ts](../../be/sockets/craftingHandler.ts)
- Crafting Component: [crafting.component.ts](../../ui/src/app/components/game/crafting/crafting.component.ts)

**Socket Events:**
- `crafting:start`, `crafting:started`, `crafting:completed`, `crafting:cancelled`, `crafting:error`, `crafting:getStatus`

**Full Documentation:** [alchemy-subcategory-implementation.md](alchemy-subcategory-implementation.md)

## Combat System

Turn-based combat with abilities, buffs/debuffs, and loot drops

**Features:**
- Real-time Socket.io (instant events, server-authoritative turn timing)
- Turn-based combat (player and monster alternate based on weapon speed)
- Combat abilities (10 abilities: 6 damage + 4 buff/debuff)
- Buff/Debuff system (stat modifiers, DoT/HoT, duration tracking, UI display)
- Timestamp-based cooldowns (real-time tracking)
- Consumable items (health/mana potions)
- Combat restart (repeat encounters without navigation)
- Damage calculation (base + skill + equipment + buffs, with crit/dodge)
- Combat stats tracking (defeats, damage, deaths, crits, dodges)
- Loot drops via drop tables

**Current Content:**
- 5 Monsters: Bandit Thug, Forest Wolf, Goblin Warrior, Goblin Scout, Goblin Shaman
- 10 Abilities: Heavy Strike, Quick Slash, Aimed Shot, Rapid Fire, Fire Bolt, Ice Shard, Battle Fury, Weaken Armor, Poison Strike, Regeneration
- 6 Combat activities at 3 locations

**Key Files:**
- Combat Service: [combatService.ts](../../be/services/combatService.ts)
- Combat Handler: [combatHandler.ts](../../be/sockets/combatHandler.ts)
- Monster Registry: [MonsterRegistry.ts](../../be/data/monsters/MonsterRegistry.ts)
- Ability Registry: [AbilityRegistry.ts](../../be/data/abilities/AbilityRegistry.ts)
- Combat Component: [combat.component.ts](../../ui/src/app/components/game/combat/combat.component.ts)

**Socket Events:**
- `combat:attack`, `combat:useAbility`, `combat:useItem`, `combat:flee`, `combat:getStatus`
- `combat:playerAttack`, `combat:monsterAttack`, `combat:abilityUsed`, `combat:itemUsed`
- `combat:buffApplied`, `combat:buffExpired`
- `combat:victory`, `combat:defeat`, `combat:fled`

**Full Documentation:** [combat-system.md](combat-system.md)

## References

For detailed implementation details, see individual system documentation files.
