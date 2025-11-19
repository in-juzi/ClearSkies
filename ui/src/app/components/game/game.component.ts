import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttributesService } from '../../services/attributes.service';
import { CombatService } from '../../services/combat.service';
import { ManualDialogService } from '../../services/manual-dialog.service';
import { ManualComponent } from '../manual/manual.component';
import { SkillsComponent } from './skills/skills.component';
import { AttributesComponent } from './attributes/attributes.component';
import { InventoryComponent } from './inventory/inventory.component';
import { LocationComponent } from './location/location.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { CharacterStatusComponent } from './character-status/character-status.component';
import { ChatComponent } from './chat/chat.component';
import { BankComponent } from './bank/bank.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { QuestTrackerComponent } from './quest-tracker/quest-tracker.component';
import { QuestJournalComponent } from './quest-journal/quest-journal.component';
import { NotificationDisplayComponent } from '../shared/notification-display/notification-display.component';
import { QuantityDialogComponent } from '../shared/quantity-dialog/quantity-dialog.component';
import { HousingComponent } from './housing/housing.component';
import { ALL_SKILLS, ALL_ATTRIBUTES } from '../../constants/game-data.constants';
import { LocationService } from '../../services/location.service';
import { QuestService } from '../../services/quest.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule, ManualComponent, SkillsComponent, AttributesComponent, InventoryComponent, LocationComponent, EquipmentComponent, CharacterStatusComponent, ChatComponent, BankComponent, WorldMapComponent, QuestTrackerComponent, QuestJournalComponent, NotificationDisplayComponent, QuantityDialogComponent, HousingComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private authService = inject(AuthService);
  private attributesService = inject(AttributesService);
  private combatService = inject(CombatService);
  private locationService = inject(LocationService);
  private questService = inject(QuestService);
  private router = inject(Router);

  manualDialogService = inject(ManualDialogService);

  currentUser = this.authService.currentUser;
  currentPlayer = this.authService.currentPlayer;
  attributes = this.attributesService.attributes;

  // Track which tab is active in the right sidebar
  rightSidebarTab = signal<'character' | 'equipment' | 'skills' | 'attributes' | 'status'>('character');

  // Track which tab is active in the left sidebar
  leftSidebarTab = signal<'inventory' | 'quests' | 'housing'>('inventory');

  // Track collapse state of sidebars
  leftSidebarCollapsed = signal(false);
  rightSidebarCollapsed = signal(false);

  // Track map dialog state
  mapDialogOpen = signal(false);

  // Track quest journal dialog state
  questJournalOpen = signal(false);

  ngOnInit(): void {
    // Fetch latest player data
    this.authService.getProfile().subscribe();

    // Fetch attributes data
    this.attributesService.getAllAttributes().subscribe();

    // Initialize quest service socket
    const token = localStorage.getItem('clearskies_token');
    if (token) {
      this.questService.initializeSocket(token);
    }

    // Check combat status (restores combat state if player was in combat on page refresh)
    this.combatService.checkCombatStatus().catch((err: any) => {
      console.error('Failed to check combat status:', err);
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  openManual(): void {
    this.manualDialogService.open();
  }

  // Get attribute names for iteration
  getAttributeNames(): string[] {
    return [...ALL_ATTRIBUTES];
  }

  // Capitalize first letter
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Calculate total skill level
  getTotalSkillLevel(): number {
    const player = this.currentPlayer();
    if (!player || !player.skills) return 0;

    return ALL_SKILLS.reduce((total, skillName) => {
      return total + (player.skills[skillName]?.level || 0);
    }, 0);
  }

  // Calculate total attribute level
  getTotalAttributeLevel(): number {
    const attrs = this.attributes();
    if (!attrs) return 0;

    return ALL_ATTRIBUTES.reduce((total, attrName) => {
      return total + (attrs[attrName]?.level || 0);
    }, 0);
  }

  // Calculate max HP from attributes
  getMaxHP(): number {
    const attrs = this.attributes();
    if (!attrs) return 10; // Base HP

    const str = attrs['strength']?.level || 1;
    const end = attrs['endurance']?.level || 1;
    const will = attrs['will']?.level || 1;

    // Formula: Base 10 + STR×3 + END×2 + WILL×1
    return 10 + (str * 3) + (end * 2) + (will * 1);
  }

  // Calculate max MP from attributes
  getMaxMP(): number {
    const attrs = this.attributes();
    if (!attrs) return 10; // Base MP

    const wis = attrs['wisdom']?.level || 1;
    const will = attrs['will']?.level || 1;

    // Formula: Base 10 + WIS×6 + WILL×3
    return 10 + (wis * 6) + (will * 3);
  }

  // Get HP percentage for bar
  getHPPercent(): number {
    const player = this.currentPlayer();
    if (!player) return 0;
    const max = this.getMaxHP();
    return max > 0 ? (player.stats.health.current / max) * 100 : 0;
  }

  // Get MP percentage for bar
  getMPPercent(): number {
    const player = this.currentPlayer();
    if (!player) return 0;
    const max = this.getMaxMP();
    return max > 0 ? (player.stats.mana.current / max) * 100 : 0;
  }

  // Get HP tooltip showing formula
  getHPTooltip(): string {
    const attrs = this.attributes();
    if (!attrs) return 'HP from attributes';

    const str = attrs['strength']?.level || 1;
    const end = attrs['endurance']?.level || 1;
    const will = attrs['will']?.level || 1;

    return `Max HP: ${this.getMaxHP()}\n\nFormula:\nBase: 10\nStrength (${str}): +${str * 3}\nEndurance (${end}): +${end * 2}\nWill (${will}): +${will * 1}`;
  }

  // Get MP tooltip showing formula
  getMPTooltip(): string {
    const attrs = this.attributes();
    if (!attrs) return 'MP from attributes';

    const wis = attrs['wisdom']?.level || 1;
    const will = attrs['will']?.level || 1;

    return `Max MP: ${this.getMaxMP()}\n\nFormula:\nBase: 10\nWisdom (${wis}): +${wis * 6}\nWill (${will}): +${will * 3}`;
  }

  // Toggle sidebar collapse state
  toggleLeftSidebar(): void {
    this.leftSidebarCollapsed.update(collapsed => !collapsed);
  }

  toggleRightSidebar(): void {
    this.rightSidebarCollapsed.update(collapsed => !collapsed);
  }

  // Open full map dialog
  openMapDialog(): void {
    this.mapDialogOpen.set(true);
  }

  // Close full map dialog
  closeMapDialog(): void {
    this.mapDialogOpen.set(false);
  }

  // Open quest journal dialog
  openQuestJournal(): void {
    this.questJournalOpen.set(true);
  }

  // Close quest journal dialog
  closeQuestJournal(): void {
    this.questJournalOpen.set(false);
  }

  // Handle travel request from map
  async handleTravelRequest(targetLocationId: string): Promise<void> {
    try {
      await this.locationService.startTravel(targetLocationId);
      // Close dialog after starting travel
      this.closeMapDialog();
    } catch (error: any) {
      console.error('Travel failed:', error);
      // Keep dialog open on error so user can see what's wrong
    }
  }
}
