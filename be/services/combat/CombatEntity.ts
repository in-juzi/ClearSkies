/**
 * Combat Entity Abstraction
 *
 * Provides a unified interface for players, monsters, and future entity types (NPCs, pets, summons)
 * Eliminates `entity.monsterId` checks throughout combat logic
 */

/**
 * Weapon data used in combat calculations
 */
export interface WeaponData {
  name: string;
  damageRoll: string;
  attackSpeed: number;
  critChance: number;
  skillScalar: string;
}

/**
 * Combat entity interface - works for players, monsters, NPCs, pets, etc.
 */
export interface ICombatEntity {
  /**
   * Get unique identifier for this entity
   */
  getId(): string;

  /**
   * Get display name
   */
  getName(): string;

  /**
   * Get entity type for targeting and buff application
   */
  getType(): 'player' | 'monster';

  /**
   * Get currently equipped weapon (or natural weapon for monsters)
   */
  getWeapon(): WeaponData | null;

  /**
   * Get current health
   */
  getCurrentHealth(): number;

  /**
   * Get maximum health
   */
  getMaxHealth(): number;

  /**
   * Get current mana
   */
  getCurrentMana(): number;

  /**
   * Get maximum mana
   */
  getMaxMana(): number;

  /**
   * Get base armor value (before buffs)
   */
  getBaseArmor(): number;

  /**
   * Get base evasion value (before buffs)
   */
  getBaseEvasion(): number;

  /**
   * Get skill level for a skill
   */
  getSkillLevel(skillName: string): number;

  /**
   * Get attribute level for an attribute
   */
  getAttributeLevel(attributeName: string): number;

  /**
   * Get raw entity data (for special cases)
   */
  getRawEntity(): any;

  /**
   * Take damage and return actual damage dealt
   */
  takeDamage(amount: number): number;

  /**
   * Heal and return actual healing done
   */
  heal(amount: number): number;

  /**
   * Use mana
   */
  useMana(amount: number): boolean;

  /**
   * Restore mana
   */
  restoreMana(amount: number): void;
}

/**
 * Player combat entity wrapper
 */
export class PlayerCombatEntity implements ICombatEntity {
  constructor(
    private player: any,
    private itemService: any
  ) {}

  getId(): string {
    return this.player._id.toString();
  }

  getName(): string {
    return this.player.characterName || this.player.username || 'Player';
  }

  getType(): 'player' | 'monster' {
    return 'player';
  }

  getWeapon(): WeaponData | null {
    if (!this.player.equipmentSlots || !this.player.inventory) {
      return null;
    }

    const mainHandId = this.player.equipmentSlots.get ?
      this.player.equipmentSlots.get('mainHand') :
      this.player.equipmentSlots.mainHand;

    if (!mainHandId) {
      return null;
    }

    const item = this.player.inventory.find((i: any) => i.instanceId === mainHandId);
    if (!item) {
      return null;
    }

    const itemDef = this.itemService.getItemDefinition(item.itemId);
    if (!itemDef || !itemDef.properties) {
      return null;
    }

    return {
      name: itemDef.name,
      damageRoll: itemDef.properties.damageRoll || '1d2',
      attackSpeed: itemDef.properties.attackSpeed || 3.0,
      critChance: itemDef.properties.critChance || 0.05,
      skillScalar: itemDef.properties.skillScalar || 'oneHanded'
    };
  }

  getCurrentHealth(): number {
    return this.player.stats.health.current;
  }

  getMaxHealth(): number {
    return this.player.maxHP;
  }

  getCurrentMana(): number {
    return this.player.stats.mana.current;
  }

  getMaxMana(): number {
    return this.player.maxMP;
  }

  getBaseArmor(): number {
    return this.player.combatStats?.armor || 0;
  }

  getBaseEvasion(): number {
    return this.player.combatStats?.evasion || 0;
  }

  getSkillLevel(skillName: string): number {
    return this.player.skills[skillName]?.level || 1;
  }

  getAttributeLevel(attributeName: string): number {
    return this.player.attributes[attributeName]?.level || 1;
  }

  getRawEntity(): any {
    return this.player;
  }

  takeDamage(amount: number): number {
    return this.player.takeDamage(amount);
  }

  heal(amount: number): number {
    return this.player.heal(amount);
  }

  useMana(amount: number): boolean {
    return this.player.useMana(amount);
  }

  restoreMana(amount: number): void {
    this.player.stats.mana.current = Math.min(
      this.player.maxMP,
      this.player.stats.mana.current + amount
    );
  }
}

/**
 * Monster combat entity wrapper
 */
export class MonsterCombatEntity implements ICombatEntity {
  constructor(private monster: any) {}

  getId(): string {
    return this.monster.monsterId;
  }

  getName(): string {
    return this.monster.name;
  }

  getType(): 'player' | 'monster' {
    return 'monster';
  }

  getWeapon(): WeaponData | null {
    if (!this.monster.equipment) {
      return null;
    }

    return this.monster.equipment.weapon || this.monster.equipment.natural || null;
  }

  getCurrentHealth(): number {
    return this.monster.stats.health.current;
  }

  getMaxHealth(): number {
    return this.monster.stats.health.max;
  }

  getCurrentMana(): number {
    return this.monster.stats.mana.current;
  }

  getMaxMana(): number {
    return this.monster.stats.mana.max;
  }

  getBaseArmor(): number {
    return this.monster.combatStats?.armor || 0;
  }

  getBaseEvasion(): number {
    return this.monster.combatStats?.evasion || 0;
  }

  getSkillLevel(skillName: string): number {
    return this.monster.skills[skillName]?.level || 1;
  }

  getAttributeLevel(attributeName: string): number {
    return this.monster.attributes[attributeName]?.level || 1;
  }

  getRawEntity(): any {
    return this.monster;
  }

  takeDamage(amount: number): number {
    const oldHealth = this.monster.stats.health.current;
    this.monster.stats.health.current = Math.max(0, oldHealth - amount);
    return oldHealth - this.monster.stats.health.current;
  }

  heal(amount: number): number {
    const oldHealth = this.monster.stats.health.current;
    this.monster.stats.health.current = Math.min(
      this.monster.stats.health.max,
      oldHealth + amount
    );
    return this.monster.stats.health.current - oldHealth;
  }

  useMana(amount: number): boolean {
    if (this.monster.stats.mana.current >= amount) {
      this.monster.stats.mana.current -= amount;
      return true;
    }
    return false;
  }

  restoreMana(amount: number): void {
    this.monster.stats.mana.current = Math.min(
      this.monster.stats.mana.max,
      this.monster.stats.mana.current + amount
    );
  }
}
