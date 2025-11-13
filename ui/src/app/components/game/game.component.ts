import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttributesService } from '../../services/attributes.service';
import { CombatService } from '../../services/combat.service';
import { ManualDialogService } from '../../services/manual-dialog.service';
import { ManualComponent } from '../manual/manual.component';
import { Skills } from './skills/skills';
import { AttributesComponent } from './attributes/attributes';
import { InventoryComponent } from './inventory/inventory.component';
import { LocationComponent } from './location/location';
import { Equipment } from './equipment/equipment';
import { CharacterStatus } from './character-status/character-status';
import { ChatComponent } from './chat/chat.component';
import { ALL_SKILLS, ALL_ATTRIBUTES } from '../../constants/game-data.constants';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule, ManualComponent, Skills, AttributesComponent, InventoryComponent, LocationComponent, Equipment, CharacterStatus, ChatComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private authService = inject(AuthService);
  private attributesService = inject(AttributesService);
  private combatService = inject(CombatService);
  private router = inject(Router);

  manualDialogService = inject(ManualDialogService);

  currentUser = this.authService.currentUser;
  currentPlayer = this.authService.currentPlayer;
  attributes = this.attributesService.attributes;

  // Track which tab is active in the right sidebar
  rightSidebarTab = signal<'character' | 'equipment' | 'skills' | 'attributes' | 'status'>('character');

  // Track which tab is active in the left sidebar
  leftSidebarTab = signal<'inventory'>('inventory');

  // Track collapse state of sidebars
  leftSidebarCollapsed = signal(false);
  rightSidebarCollapsed = signal(false);

  ngOnInit(): void {
    // Fetch latest player data
    this.authService.getProfile().subscribe();

    // Fetch attributes data
    this.attributesService.getAllAttributes().subscribe();

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

  // Toggle sidebar collapse state
  toggleLeftSidebar(): void {
    this.leftSidebarCollapsed.update(collapsed => !collapsed);
  }

  toggleRightSidebar(): void {
    this.rightSidebarCollapsed.update(collapsed => !collapsed);
  }
}
