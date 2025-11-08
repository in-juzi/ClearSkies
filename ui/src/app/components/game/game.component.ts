import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Skills } from './skills/skills';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, Skills],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  currentPlayer = this.authService.currentPlayer;

  ngOnInit(): void {
    // Fetch latest player data
    this.authService.getProfile().subscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
