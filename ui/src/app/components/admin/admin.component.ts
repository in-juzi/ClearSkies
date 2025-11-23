import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(private router: Router) {}

  navigateToGame(): void {
    this.router.navigate(['/game']);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
}
