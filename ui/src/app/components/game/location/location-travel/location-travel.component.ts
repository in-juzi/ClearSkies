import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../../services/location.service';
import { ConfirmDialogService } from '../../../../services/confirm-dialog.service';
import { ChatService } from '../../../../services/chat.service';

@Component({
  selector: 'app-location-travel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-travel.component.html',
  styleUrl: './location-travel.component.scss'
})
export class LocationTravelComponent {
  private locationService = inject(LocationService);
  private confirmDialog = inject(ConfirmDialogService);
  private chatService = inject(ChatService);

  // Exposed signals from service
  currentLocation = this.locationService.currentLocation;
  travelState = this.locationService.travelState;

  /**
   * Cancel current travel
   */
  async cancelTravel() {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Cancel Travel',
      message: 'Are you sure you want to cancel travel? You will return to your previous location.',
      confirmLabel: 'Yes, Cancel',
      cancelLabel: 'No, Continue'
    });

    if (!confirmed) {
      return;
    }

    this.locationService.cancelTravel()
      .then((response: any) => {
        this.logToChat(response.message, 'success');
        this.locationService.getCurrentLocation().subscribe(); // Refresh location
      })
      .catch((err: any) => {
        this.logToChat(err.error?.message || 'Failed to cancel travel', 'error');
      });
  }

  /**
   * Format time remaining in seconds to MM:SS
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get progress percentage for travel
   */
  getTravelProgressPercent(): number {
    const travel = this.travelState();

    if (!travel || !travel.isTravel || !travel.startTime || !travel.endTime) {
      return 0;
    }

    const start = new Date(travel.startTime).getTime();
    const end = new Date(travel.endTime).getTime();
    const now = Date.now();

    const total = end - start;
    const elapsed = now - start;

    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  /**
   * Log a message to chat
   */
  private logToChat(message: string, type: 'info' | 'error' | 'success' = 'info'): void {
    const prefix = type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : 'ℹ️ ';
    this.chatService.addLocalMessage({
      userId: 'system',
      username: 'System',
      message: `${prefix}${message}`,
      createdAt: new Date()
    });
  }
}
