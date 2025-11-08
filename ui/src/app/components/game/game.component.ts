import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttributesService } from '../../services/attributes.service';
import { Skills } from './skills/skills';
import { AttributesComponent } from './attributes/attributes';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, Skills, AttributesComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private authService = inject(AuthService);
  private attributesService = inject(AttributesService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  currentPlayer = this.authService.currentPlayer;
  attributes = this.attributesService.attributes;

  ngOnInit(): void {
    // Fetch latest player data
    this.authService.getProfile().subscribe();

    // Fetch attributes data
    this.attributesService.getAllAttributes().subscribe();
  }

  onLogout(): void {
    this.authService.logout();
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
