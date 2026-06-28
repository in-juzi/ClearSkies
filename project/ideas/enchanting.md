# Enchanting — Crystallized Essences & Socketables

> **Lore basis**: Monsters are born of magic, and that mana is conserved. On defeat it crystallizes into a **crystallized essence** drop (e.g. "Essence of the Goblin"). See [story.md](story.md).

> **Engine basis**: This is NOT a new system. A socketable is just an item that carries effect-system *applicators* (context + modifier + condition), injected into a host item. The data-driven effect evaluator already aggregates applicators from every equipped item via `(base + flat) * (1 + percentage) * multiplier`. The architecture explicitly anticipates this ("Future: Check affixes"). See project/docs/047 and 048.

## Locked decisions (2026-06-28)

The design conversation locked these. Build the foundation slice against them.

- **Enchanting is its own skill**, `mainAttribute: 'wisdom'`. Rationale: it's *magical crafting*, and wisdom is the magic attribute with **no** production skill today (the production skills only key off strength/endurance/will — wisdom and dexterity have none). A new wisdom skill fills that gap; folding into will-based `alchemy` would deepen the imbalance. See [the domain thesis](#enchantings-domain-what-it-is-and-isnt).
- **Socket count is rarity-gated and *derived*** (common 0, uncommon 1, rare 2, epic 3, legendary 4) via a single `getSocketCount(instance, def)` helper. Contents are stored as a **sparse list of filled sockets** on the item instance, so capacity and contents are decoupled — the count rule stays swappable (rarity→quality, or a later "add socket" craft via an additive `addedSockets` field) with no destructive migration.
- **Socket replacement is removable-for-a-cost** (an extraction action consuming a separate *solvent* reagent; the sigil pops back out intact). This is the agile spine: it's the superset of free (cost 0) and destructive (cost = the gem), tunable to anywhere on that spectrum via one data value, and the direction of future change (loosening the cost) stays player-friendly. Long-term gem demand comes from **tiering/progression churn**, not from punishing swaps. *Build note:* the v1 slice only sockets into **empty** sockets; extraction is the immediate fast-follow.
- **Socketables are called *Sigils*** (proposed; "Rune" is the alt). A sigil is a gem-vessel with a monster's essence bound in. Distinct word from its inputs ("gem"/"essence"/"crystal" all already name ingredients). itemId `sigil_<family>`, file `Sigil<Family>.ts`, new `SUBCATEGORY.SOCKETABLE = 'socketable'` as the functional tag the socket system keys on. Final display-name style (flat "Goblinoid Sigil" vs flavor "Sigil of Greed") still open.
- **Two orthogonal inputs: essence = the effect, gem = the magnitude.** The essence (monster family) decides *what* the sigil does; the gem-vessel's capacity (clarity/tier — see [story.md](story.md) "Gems, vessels, and binding") decides *how strong*. Keeps it to ~4 recipes (one per essence, gem matched by `subcategory: gemstone`), and the magnitude scales off a value that already exists, solving the tiering TODO for free.

## Enchanting's domain: what it *is* and isn't

> **Enchanting is the manipulation of crystallized mana. Full stop. It never shapes inert material — it only works the magic that material can hold.**

The risk this thesis guards against: "enchanting" silently absorbing jewelcrafting/goldsmithing and becoming a muddy "gem skill" that overlaps smithing. The fix is a hard boundary — enchanting owns the **mana**, never the **rock or metal**. That turns a naming collision into a clean supply chain:

| Skill | Owns | Example |
|---|---|---|
| **Mining** (str) | pulling raw gems / ore from the earth | rough Ruby, iron ore |
| **Jewelcrafting** (dex) | shaping inert material into fine vessels | cut gem, the gold ring/amulet base — see [jewelcrafting.md](jewelcrafting.md) |
| **Smithing** (end) | shaping material into weapons/armor/tools (brute force, hammer & forge) | sword, plate |
| **Enchanting** (wis) | everything done to **mana/essence** | bind essence into the vessel, charge the ring |

**The keep-it-clean test** for any future craft: *does its core action manipulate mana/essence? → enchanting. Does it shape an inert material into a form? → smithing/jewelcrafting/mining.* (Cut the gem? Jewelcrafting. Forge the ring? Jewelcrafting. Bind the goblin's greed into that ring? Enchanting.)

### Expansion roadmap — every enchanting craft is a verb applied to mana

Not one of these shapes material; that's what keeps the skill coherent.

- **Bind** — essence + vessel → sigil *(v1)*
- **Socket** — install a sigil's mana into gear *(v1)*
- **Extract** — a solvent loosens the binding to recover a sigil *(removal fast-follow)*
- **Refine / concentrate** — combine lesser essences into a greater one *(tiering)*
- **Transmute** — convert one family's essence into another at a loss *(economy lever / pity for unwanted drops)*
- **Imbue / inscribe** — apply a mana effect to an item *without* a socket — the bridge to the deterministic-craft path of [affixes.md](affixes.md)
- **Disenchant** — break a magical item back down into essence / mana-dust *(sink + source)*
- **Charge** — mana-infused consumables: wards, runestones, throwables, scrolls

## The core loop

Every monster killed drops a crystallized essence in addition to its normal loot. Essences are deliberately **versatile** so there is always demand:

1. **Sell to NPCs for gold** — the price floor. Guarantees every kill is rewarding even when the socketable market is glutted.
2. **Enchanting** — combine an essence with other materials (e.g. a gem from mining) via a crafting skill action to produce a **socketable**. The socketable carries some aspect of the source monster, and is then placed into an equippable item's socket.

The promise: engaging with monsters gives you their normal drops (valuable on their own) **plus** essences that feed a perpetually-demanded crafting input.

## Thematic mapping (author per FAMILY, not per monster)

Effects should reflect the creature. Crucially, author these at the **monster-family / archetype** tier, not per individual monster — otherwise content work is unbounded. The effect system models families via `ConditionType.TARGET_FAMILY` (`beast`, `undead`, `goblinoid`, ...).

Examples:
- **Goblinoid essence** → socketable for a weapon: chance to **steal gold on hit** from monsters.
- **Bone/undead essence** (skeletons et al.) → socketable for armor: chance to **avoid projectiles** (their negative space lets projectiles pass through) → `COMBAT_EVASION` filtered by damage type.
- **Beast essence** → TBD.

Individual monsters drop their family essence; **bosses / elites** can drop rare unique essences for high-end recipes.

### Families are multi-valued

A monster belongs to **one or more** families (`families: string[]`), not exactly one. A Goblin Shaman is `["goblinoid", "caster"]`; a future skeletal wolf is `["undead", "beast"]`. Consequences:

- **Condition matching** is intersection: a `TARGET_FAMILY` effect fires if *any* of the monster's families is in the effect's allowed list. `isConditionMet` is now array-aware on the monster side (reads `target.families`); the only remaining gap is populating the field on monsters.
- **Essence drops** — DECIDED + implemented: a multi-family monster drops **one essence per family** (the goblin shaman yields a goblinoid *and* a caster essence). See the drop mechanism below.

### Family → effect table

Grounded in the current roster (goblinoid: goblins; beast: wolves; humanoid: bandits) plus foreshadowed families. Note the **channel** column — not every essence is a trigger; passive ones are plain applicators that work today:

| Family | Lore theme | Essence | Example socketable effect | Channel |
|---|---|---|---|---|
| **Goblinoid** | greed, cunning | Essence of the Goblin | weapon: chance to **steal gold on hit** | trigger — `ON_HIT` / `STEAL_GOLD` |
| **Beast** | predator instinct | Essence of the Beast | weapon: **+crit chance** (passive) | passive — `COMBAT_CRIT_CHANCE` |
| **Humanoid** | martial opportunism | Essence of the Outlaw | armor: chance to **heal on kill** | trigger — `ON_KILL` / `HEAL` |
| **Undead / bone** *(future)* | hollow, relentless | Essence of the Restless | armor: chance to **avoid projectiles** | passive — `COMBAT_EVASION`, damage-type gated |
| **Aberrant / mutated** *(future)* | raw wild mana | Essence of Aether | weapon: **bonus elemental damage on hit** | trigger — `ON_HIT` / `DEAL_DAMAGE` |

### How essences drop (implemented)

Essences are **not** entries in the weighted loot tables — those pick one-of-many probabilistically, but lore says essences are *guaranteed* ("you always get something for a kill"). Instead they're **derived from the monster's `families`** in the reward flow:

- `FAMILY_ESSENCE` (`shared/constants/essence-constants.ts`) maps each family → an essence item id.
- On victory, `combatService.awardCombatRewards` rolls the normal loot tables, then **appends one essence per mapped family** before handing everything to the reward processor. So essences always drop, *in addition to* normal loot, with zero per-monster loot-table edits.
- Adding a monster or a new family essence "just works" — tag the monster's `families` and (if new) add a `FAMILY_ESSENCE` entry + the item.

Essence items live in `be/data/items/definitions/resources/` (`essence_goblinoid`, `essence_beast`, `essence_humanoid`, `essence_caster`). They're stackable resources tagged `monster-drop / enchanting / magical`, carry a `sheen` quality slot (for future tiering), and have a `baseValue` so the **sell-to-NPC floor** works today. `undead`/`aberrant` have no essence yet (no monsters of those families); `FAMILY_ESSENCE` is a partial map, so they simply drop nothing until added.

## Why this stays valuable (the economy)

Guaranteed-drop-per-kill is a supply firehose. To hold the "always in demand" promise, the loop needs **churn and tiering**:

- **Sockets consume the essence** and replacing a socket is destructive (swap = re-craft). Creates ongoing demand instead of one-and-done.
- **Tiered essences** (common goblin vs. elite goblin) so high-end demand never saturates even when low-end is glutted.
- **NPC vendor = price floor** so essence is never worthless, only sometimes floor-valued.

## How it relates to affixes

Sockets/essences are the **deterministic, player-chosen** path to power. Affixes are the **random, gambled** path. Keep them psychologically distinct — both feed the same effect engine, but one you *choose* and one you *chase*. See [affixes.md](affixes.md).

## Open questions / TODO

- [ ] **Essence sink mechanic** — confirm sockets consume essence and are destructive to replace; decide reroll/upgrade rules.
- [x] **Triggered effects channel** — on-hit/on-crit/on-kill/on-being-hit etc. now exist as a second effect channel (foundational slice implemented). Gold-steal-on-hit is expressible today. See [triggered-effects.md](triggered-effects.md). Remaining: buff-backed actions + ability-attack hooks (tracked there).
- [x] **Family → effect table** — drafted above (goblinoid, beast, humanoid + foreshadowed undead/aberrant).
- [x] **`families` field on `Monster`** — DONE. Added `MonsterFamily` union + required `families: MonsterFamily[]` in `shared/types/combat.ts`; tagged all 5 monsters (shaman is `["goblinoid","caster"]` to exercise the multi-family path). Flows into the monster instance → `runtime.target.families` → `TARGET_FAMILY` with no extra wiring. **The family-targeting system is now functional end to end** — family-gated effects (passive or triggered) are pure-data buildable.
- [x] **Array-aware `TARGET_FAMILY`** — `isConditionMet` now intersects the monster's `families` array with the condition's allowed list. Condition renamed `TARGET_TYPE` → `TARGET_FAMILY` (it was unused content-wise, so zero-cost).
- [x] **Essence drop mechanism** — DONE. Guaranteed, family-derived essences via `FAMILY_ESSENCE` + `awardCombatRewards`; 4 essence items created (goblinoid/beast/humanoid/caster). One essence per family. See "How essences drop" above.
- [ ] **`DAMAGE_TYPE` condition** — needed for the undead "avoid projectiles" effect; no such `ConditionType` exists yet.
- [ ] **Undead / aberrant essences** — add the items + `FAMILY_ESSENCE` entries when monsters of those families exist.
- [ ] **Tiered essences** — the `sheen` quality slot is reserved but unused; scale essence quality off monster level / player perception so high-end demand never saturates (the economy lever below).
- [x] **Socket model on items** — DECIDED: **rarity-gated, derived** (common 0 → legendary 4) via `getSocketCount`; contents stored as a sparse filled-socket list on the instance so the count rule stays swappable. See Locked decisions.
- [x] **Own skill vs. existing** — DECIDED: its own **`enchanting`** skill, `mainAttribute: 'wisdom'`. See Locked decisions + domain thesis.
- [x] **Socketable naming** — DECIDED (proposed): **Sigil**, `SUBCATEGORY.SOCKETABLE`, `sigil_<family>`. Display-name style still open.
- [x] **Essence + gem → what each contributes** — DECIDED: essence = effect, gem-vessel capacity = magnitude. See Locked decisions + [story.md](story.md) gem lore.
- [ ] **Socket replacement / extraction** — policy locked (removable-for-cost via a *solvent* reagent), but the solvent item + extraction action are unbuilt. v1 sockets into empty only.
- [ ] **Enchanting / socketing recipes — THE NEXT BUILD.** How socketing injects a sigil's applicators/triggers into the host item instance (extend the `effectEvaluator` walk to read `item.sockets[].socketableItemId` → sigil def's `socketEffect`), the `socketEffect: { applicators?, triggers? }` field on socketable defs, the bind recipe (1 essence + 1 gemstone → 1 sigil, skill `enchanting`), and `getSocketCount`. How does it use the integrity/quality crafting model in [crafting.md](crafting.md)?
- [ ] **Jewelcrafting feeder skill** — planned DEX fine-crafting skill that produces the cut-gem / ring / amulet *vessels* enchanting binds into (also creates rings/amulets, which currently can't be crafted, and fills the dexterity production gap). See [jewelcrafting.md](jewelcrafting.md). v1 enchanting can use raw mined gems as vessels until this exists.
- [ ] **Content Generator** — new monsters need a `families` array (build enforces it); essences need a `FAMILY_ESSENCE` entry. Worth a note in `project/docs/005-content-generator-agent.md`.
