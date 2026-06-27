# ClearSkies - Medieval Fantasy Browser Game

> **Session continuity**: Progress, recent changes, and "what's next" are tracked via `/handoff` journals — not in this file. CLAUDE.md holds only stable, always-relevant project facts.

## Project Overview

ClearSkies is a medieval fantasy browser-based game:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)
- **Auth**: JWT-based with bcrypt password hashing
- **Deployment**: AWS S3 (frontend) + EC2 (backend) with Cloudflare proxy (SSL/TLS + CDN)
- **Production URL**: https://clearskies.juzi.dev

## Quick Task Guide

**Add items to player:** `cd be && node utils/add-item.js` (edit itemId on line 28)
**Create content:** Use Content Generator agent — describe what you want in natural language
**Validate game data:** `cd be && npm run validate` — checks all cross-references
**Add recipe:** Create TS module in `be/data/recipes/{skill}/{RecipeId}.ts` and register in RecipeRegistry
**Add item/activity/drop table:** Create TS module under `be/data/...` and register in the matching Registry
**Make migration:** `be/migrations/NNN-description.js` (see Database Migrations below)
**Deploy to production:** `cd ui && npm run deploy` — builds + uploads to S3 with CloudFront invalidation

> **Dev shells**: Claude maintains the dev servers — backend `cd be && npm run dev` and frontend `cd ui && npm run start` (`ng serve`). Run them as **background tasks** so logs are readable across turns, and start/restart them as needed (e.g. after dependency installs or backend code changes) without asking. Check whether one is already running before starting a duplicate.

> **Content creation**: Before adding monsters/locations/activities/drop tables, read [project/docs/019-content-creation-pitfalls.md](project/docs/019-content-creation-pitfalls.md).

## Critical Rules

### Code Changes
- Backend model/schema change → create migration in `be/migrations/`
- New dependency → restart the affected dev shell (Claude-managed background task)
- Use Angular **signals** for state management
- Game components live under `ui/src/app/components/game/`
- Use the Edit tool first; fall back to bash only if it fails twice; batch related changes

### Authentication
- All endpoints require JWT **except** `/api/auth/register` and `/api/auth/login`
- Token in localStorage key: `clearskies_token`
- Use `req.user._id` for the user id (NOT `req.user.userId`)

### Item System
- Definitions in `be/data/items/definitions/{category}/`; always go through `ItemService`
- Quality levels: **1–5** (discrete integers); Trait levels: **1–3** (stored as `Map<traitId, level>`)
- Items stack only if same `itemId` + quality + traits

### ⚠️ Mongoose Maps (common footgun)
Map fields (`{ type: Map, of: ... }`) **do not** support bracket notation and `Object.entries()` returns empty.
- Read values with `.get()`: `selectedIngredients.get(ingredient.itemId)` (NOT `selectedIngredients[...]`)
- To enumerate: `Object.fromEntries(map)` after `.toObject()`

### Content Creation
- New items/activities → Content Generator agent
- Validation → Content Validator agent (or `npm run validate`)

## Database Models

- **User** ([be/models/User.js](be/models/User.js)): auth (username, email, password hash)
- **Player** ([be/models/Player.ts](be/models/Player.ts)): game data (skills, attributes, inventory, equipment, quests, housing)
- **Property** ([be/models/Property.ts](be/models/Property.ts)): player-owned land with building slots
- **ConstructionProject** ([be/models/ConstructionProject.ts](be/models/ConstructionProject.ts)): ongoing building projects

> Route files live in `be/routes/`; controllers/services/sockets follow the same per-domain naming. Use Glob/Grep to locate specifics rather than maintaining file lists here.

## Database Migrations

Schema changes require migrations to update existing records.
- **Commands:** `npm run migrate` | `npm run migrate:status` | `npm run migrate:down`
- **Location:** `be/migrations/NNN-description.js`
- **Docs:** [project/docs/034-database-migrations.md](project/docs/034-database-migrations.md)

## Environment Variables

Backend requires a `.env` with: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`.

## System Documentation

Detailed references (read on demand):

**Architecture**
- [075-typescript-architecture.md](project/docs/075-typescript-architecture.md) — shared types, constants, registries
- [076-deployment-guide.md](project/docs/076-deployment-guide.md) — AWS, Cloudflare, production
- [033-socketio-architecture.md](project/docs/033-socketio-architecture.md) — real-time communication

**Game Systems**
- [015-inventory-system.md](project/docs/015-inventory-system.md) — items, quality, traits, stacking
- [031-location-system.md](project/docs/031-location-system.md) — locations, facilities, activities, drop tables
- [032-xp-system.md](project/docs/032-xp-system.md) — skills, attributes, XP scaling
- [041-attribute-progression-system.md](project/docs/041-attribute-progression-system.md) — HP/MP/capacity formulas
- [017-combat-system.md](project/docs/017-combat-system.md) — turn-based combat, monsters, abilities
- [053-quest-system-testing-guide.md](project/docs/053-quest-system-testing-guide.md) — quest system

**UI & Design**
- [073-design-system-reference.md](project/docs/073-design-system-reference.md) — night sky theme, 600+ tokens
- [074-scss-mixin-library-reference.md](project/docs/074-scss-mixin-library-reference.md) — SCSS mixins
- [077-ui-utilities-reference.md](project/docs/077-ui-utilities-reference.md) — rarity pipes, filters, sort utils

**Effect System**
- [046-modifier-audit-and-consolidation.md](project/docs/046-modifier-audit-and-consolidation.md) — audit
- [047-data-driven-effect-system-implementation.md](project/docs/047-data-driven-effect-system-implementation.md) — implementation
- [048-creating-traits-and-affixes-guide.md](project/docs/048-creating-traits-and-affixes-guide.md) — creating effects

**Content Creation**
- [005-content-generator-agent.md](project/docs/005-content-generator-agent.md) — AI content creation
- [019-content-creation-pitfalls.md](project/docs/019-content-creation-pitfalls.md) — common issues

**Project Management**
- [012-completed-features.md](project/docs/012-completed-features.md) — full feature history
- [034-database-migrations.md](project/docs/034-database-migrations.md) — migration guide
