/**
 * Notification Service
 *
 * Provides toast notifications for quest updates, achievements, and other events.
 * Uses a simple, non-intrusive notification system.
 */

import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'quest';
  title: string;
  message: string;
  duration?: number; // milliseconds, default 5000
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Signal for reactive notifications
  private notificationsSignal = signal<Notification[]>([]);
  public notifications = this.notificationsSignal.asReadonly();

  private notificationCounter = 0;

  /**
   * Show a notification
   */
  show(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const id = `notification-${++this.notificationCounter}`;
    const timestamp = new Date();
    const duration = notification.duration ?? 5000;

    const newNotification: Notification = {
      ...notification,
      id,
      timestamp
    };

    // Add to notifications array
    this.notificationsSignal.update(notifications => [...notifications, newNotification]);

    // Auto-dismiss after duration
    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  /**
   * Show a success notification
   */
  success(title: string, message: string, duration?: number): void {
    this.show({ type: 'success', title, message, duration });
  }

  /**
   * Show an info notification
   */
  info(title: string, message: string, duration?: number): void {
    this.show({ type: 'info', title, message, duration });
  }

  /**
   * Show a warning notification
   */
  warning(title: string, message: string, duration?: number): void {
    this.show({ type: 'warning', title, message, duration });
  }

  /**
   * Show an error notification
   */
  error(title: string, message: string, duration?: number): void {
    this.show({ type: 'error', title, message, duration });
  }

  /**
   * Show a quest notification (special styling)
   */
  quest(title: string, message: string, duration?: number): void {
    this.show({ type: 'quest', title, message, duration: duration ?? 7000 });
  }

  /**
   * Dismiss a notification by ID
   */
  dismiss(id: string): void {
    this.notificationsSignal.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.notificationsSignal.set([]);
  }
}
