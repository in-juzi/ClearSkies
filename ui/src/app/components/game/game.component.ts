import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttributesService } from '../../services/attributes.service';
import { ManualDialogService } from '../../services/manual-dialog.service';
import { ManualComponent } from '../manual/manual.component';
import { Skills } from './skills/skills';
import { AttributesComponent } from './attributes/attributes';
import { InventoryComponent } from './inventory/inventory.component';
import { LocationComponent } from './location/location';
import { Equipment } from './equipment/equipment';
import { CharacterStatus } from './character-status/character-status';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule, ManualComponent, Skills, AttributesComponent, InventoryComponent, LocationComponent, Equipment, CharacterStatus],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private authService = inject(AuthService);
  private attributesService = inject(AttributesService);
  private router = inject(Router);

  manualDialogService = inject(ManualDialogService);

  currentUser = this.authService.currentUser;
  currentPlayer = this.authService.currentPlayer;
  attributes = this.attributesService.attributes;

  // Track which tab is active in the right sidebar
  rightSidebarTab = signal<'character' | 'equipment' | 'skills' | 'attributes' | 'status'>('character');

  // Track which tab is active in the left sidebar
  leftSidebarTab = signal<'inventory'>('inventory');

  ngOnInit(): void {
    // Fetch latest player data
    this.authService.getProfile().subscribe();

    // Fetch attributes data
    this.attributesService.getAllAttributes().subscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }

  openManual(): void {
    this.manualDialogService.open();
  }

  // Get attribute names for iteration
  getAttributeNames(): string[] {
    return ['strength', 'endurance', 'magic', 'perception', 'dexterity', 'will', 'charisma'];
  }

  // Capitalize first letter
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
