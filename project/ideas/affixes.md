# Affixes / Modifiers (ARPG-style)

> **Not greenfield.** This extends the existing **data-driven effect system** (project/docs/047 implementation, 048 creation guide, 051 complete). The effect evaluator already aggregates applicators (context + modifier + condition) from every equipped item and anticipates affixes explicitly ("Future: Check affixes" in the architecture, plus a sketched prefix/suffix list in doc 051). What's missing is the **rolling/generation + instance-storage layer**, not the math.

## Goal

All equippable items can carry affixes/modifiers, à la Path of Exile. Items **drop or are crafted** with these modifiers, letting players **find** or **randomly craft** high-value items. Affixes tie into socketables/essences and any other system — those systems imbue or modify the affixes.

## The unifying model: four sources, one engine

Quality, trait, affix, and socket are now **all just applicator carriers** — the engine treats them identically. The ONLY real distinction is *how the player obtains and controls them*. This is the core design axis and what makes each feel different:

| Source | How you get it | Player control | Feel |
|---|---|---|---|
| **Quality** | crafting/gathering outcome | indirect (skill/inputs) | earned |
| **Trait** | authored into base item def | none — item identity | fixed |
| **Affix** | random roll on drop/craft | gambling — reroll to chase | the slot machine |
| **Socket (essence)** | deterministic craft from known essence | full — you choose exactly | the build choice |

Affixes are the **random/gambled** loop; essences are the **deterministic/chosen** loop ([enchanting.md](enchanting.md)). Keep them distinct — don't let both become "another way to roll a random mod."

## What an affix is, concretely

An affix = a trait-like bundle of applicators that (a) **rolls randomly** within a tier range and (b) lives in an **item-instance slot** rather than being authored into the item definition. Borrow PoE structure:

- **Prefixes / suffixes** with distinct pools ("Sharp" +damage / "of the Bear" +HP).
- **Tiers** with value ranges, gated by item level.
- **Legendary/unique affixes** — multi-effect, conditional, build-defining.

## Open questions / TODO

- [ ] **Instance storage** — where do rolled affixes live on the item instance? (Item def holds *traits*; affixes need a parallel instance-level array with rolled values.) Compare with how quality/traits are already stored.
- [ ] **Power budget** — quality × traits × affixes × sockets all multiply through `(base+flat)*(1+pct)*mult`. Needs bounds: affix tiers gated by item level, socket count gated by rarity, max affixes per item. Prevents multiplicative blowups. (Doc 048 already hand-caps single effects at +50% — formalize this.)
- [ ] **Crafting interaction** — how do players "randomly craft" affixes? PoE-style currency/orbs? How does this interact with the integrity/quality crafting model in [crafting.md](crafting.md)?
- [ ] **Essence/socket imbuing** — define how socketables "modify the affixes" (add? reroll? upgrade tier? lock a prefix?).
- [ ] **Drop generation** — affix rolling on monster/instance drops; tie to item level / monster tier / the "mirror instance" rare-find idea in [story.md](story.md).
- [ ] **Display** — affix naming (prefix + base + suffix), rarity coloring; check existing rarity pipes (project/docs/077).
