import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-loading.component.html',
  styleUrl: './global-loading.component.scss'
})
export class GlobalLoadingComponent {
  private authService = inject(AuthService);

  // Show loading overlay during auth initialization
  isInitializing = computed(() => this.authService.initializing());
}
