# Jewelcrafting — Fine Material Craft (the vessel feeder)

> **Status:** planned skill, not yet built. Captured 2026-06-28 from the enchanting design conversation. The v1 enchanting slice ([enchanting.md](enchanting.md)) uses **raw mined gems** as vessels; jewelcrafting slots in later as the *proper* vessel source without a rewrite (the sigil already reads vessel capacity off the gem).

## Why this skill exists

Three problems, one skill:

1. **Brute force ≠ fine work.** Smithing is a hammer-and-forge skill (heat + force) — right for weapons and armor, wrong for shaping a delicate gem or a thin gold band. Jewelry work wants steady hands and precision, not an anvil.
2. **Rings and amulets currently can't be crafted at all.** There's no skill that makes wearable jewelry bases.
3. **Dexterity has no production skill.** Across all production skills today the only attributes used are strength/endurance/will; **dexterity and wisdom have none** (dexterity only powers dualWield + ranged combat). Enchanting fills the wisdom gap; jewelcrafting fills the dexterity gap.

## Identity — the deliberate opposite of smithing

| | Smithing | **Jewelcrafting** |
|---|---|---|
| Tool | hammer, forge, anvil | fine tools — file, graver, jeweler's chisel, loupe |
| Method | heat & brute force | precision & patience |
| Attribute | endurance | **dexterity** |
| Makes | weapons, armor, tools | **cut gems + rings / amulets / settings** (the vessels) |

**Name:** *Jewelcrafting* (proposed — instantly legible, and unlike "enchanting" it's correct to name this one after the material/profession because it really is mundane material work). Alternatives considered: *Jeweling*, *Lapidary* (too narrowly gem-cutting).

## Where it sits in the supply chain

Every production skill keys to a different attribute, and value compounds down the chain:

```
Mining (STR)        → rough gems + precious-metal ore
Jewelcrafting (DEX) → cut gems + ring/amulet bases        ← the VESSEL
Enchanting (WIS)    → binds essence into the vessel → sigil ← the MAGIC
   ↑ essence from Combat
Smithing (END) stays in its lane: weapons / armor / tools
```

## The hidden payoff: compounding quality

Because a vessel is now a *crafted* object (not a raw rock), the "gem clarity = mana capacity" lore ([story.md](story.md)) gets richer — capacity reflects the **jeweler's cut**, not just the gem's intrinsic tier:

> **vessel capacity = raw gem tier (miner) × cut quality (jeweler) → sigil magnitude (enchanter)**

Three contributors' craftsmanship compound into one sigil's power — a deep value chain and a healthy multi-skill economy.

## What jewelcrafting produces (sketch)

- **Cut gems** — refine a rough mined gem into a faceted vessel; cut quality → vessel capacity.
- **Jewelry bases** — rings, amulets, circlets (new `equipment` items in the `necklace`/`ringLeft`/`ringRight` slots, which currently have no craftable items). These carry sockets per the rarity-gated model, so enchanters charge them.
- **Settings** — bind a cut gem into a metal base (the mundane "set the stone" step), distinct from enchanting's "bind the mana" step.

## Open questions / TODO

- [ ] **Skill registration** — add `'jewelcrafting'` to `SkillName` (`shared/types/common.ts`) + the Player schema skills block (`mainAttribute: 'dexterity'`), recipe folder `be/data/recipes/jewelcrafting/`, UI tab.
- [ ] **Does it own gem-cutting, jewelry bases, *and* stone-setting, or a subset?** Leaning all three (coherent "fine valuables" identity); don't over-fragment.
- [ ] **Cut quality model** — how cut quality is determined (skill/attribute/inputs) and how it writes into the vessel's `sheen`/capacity. Ties to the integrity/quality crafting model in [crafting.md](crafting.md).
- [ ] **Jewelry base items** — define ring/amulet equipment defs; confirm they take the same socket/effect plumbing as weapons/armor.
- [ ] **Remaining attribute gaps** — perception and charisma still have no production skill (future: an appraisal/gathering skill? a trading skill?). Noted, not scoped here.
