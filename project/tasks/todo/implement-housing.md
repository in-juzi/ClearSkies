# Implement Housing

**Status:** In Progress
**Priority:** Medium
**Created:** 2025-11-09
**Plan refreshed:** 2026-06-27

## Current State (2026-06-27)

Housing is substantially built. The remaining near-term work is a single UI view.

### Backend ✅ complete
- **HTTP** (`be/routes/housing.ts` + `housingController.ts`): properties (list / details / tiers), `purchase-plot`, projects (list / by-location / abandon).
- **Socket** (`be/sockets/constructionHandler.ts`): `construction:createProject`, `contribute`, `joinProject`, `getStatus`, `browseProjects`; emits `projectCreated` / `projectProgress` / `projectCompleted` / `projectAbandoned`.
- **Models**: `Property`, `ConstructionProject`.

### Frontend service ✅ complete
- `ui/src/app/services/housing.service.ts` — all HTTP + socket methods incl. `contribute`, `joinProject`, `getProjectStatus`, `getProgress`, plus real-time listeners that update signals (`activeProjects`, `locationProjects`, `properties`, …).

### Frontend component 🔧 partial
`ui/src/app/components/game/housing/housing.component.ts` (mounted as the left-sidebar "housing" tab in `game.component.ts`):
- ✅ **My Properties** view — renders property cards.
- ✅ **Purchase Plot** view — tier selection, affordability checks, purchase → auto-creates a construction project.
- ❌ **Active Projects** view — currently a **placeholder** (`housing.component.html:143`: "Construction projects will be displayed here").

### Cleanup done
- Deleted empty Angular CLI scaffold stubs `housing.ts` / `housing.html` / `housing.scss` (were imported nowhere; the real component is `housing.component.*`).

## Near-term task: Build the Active Projects view

The backend + service are ready and waiting — this is purely UI wiring.

- [ ] Render `housingService.activeProjects()` as a list of project cards.
- [ ] Progress bar per project using `housingService.getProgress(project)` (`completedActions / totalActions`).
- [ ] **Contribute** action → `housingService.contribute(projectId, actionCount)` (the core "building" interaction).
- [ ] Join an existing project at the current location → `joinProject` / `browseProjects` (decide whether multiplayer co-build is in scope for v1, or solo-only).
- [ ] Abandon project → `housingService.abandonProject(projectId)` (with confirm dialog).
- [ ] Completion handling — service already listens to `construction:projectCompleted` and reloads properties; ensure the view reflects it (toast/refresh).
- [ ] Verify real-time updates render live (service updates signals on `construction:projectProgress`).

## Future scope (wishlist, not started)

From the original broad spec — capture as separate tasks when prioritized:
- Interior customization (furniture, decorations as items)
- Storage chests as inventory/storage expansion
- In-house crafting stations (anvil, alchemy table, cooking hearth)
- Trophy displays for achievements
- Player visitors / social features
- Maintenance costs (rent, taxes) as a gold sink
- Upgradeable house tiers progression beyond initial purchase

## Integration points

- Location system (plots tied to `locationId`)
- Inventory/economy (gold cost, future furniture items)
- Construction skill (tier `requiredLevel`, property cap)
- Crafting system (future: furniture recipes, in-house stations)
