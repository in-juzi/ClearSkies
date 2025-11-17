import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-display.component.html',
  styleUrl: './notification-display.component.scss',
})
export class NotificationDisplay {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications;

  /**
   * Dismiss a notification
   */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  /**
   * Get icon for notification type
   */
  getIcon(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'quest':
        return 'assignment_turned_in';
      default:
        return 'info';
    }
  }
}
