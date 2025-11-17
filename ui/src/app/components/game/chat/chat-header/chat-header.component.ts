import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss'
})
export class ChatHeaderComponent {
  @Input() isCollapsed: boolean = true;
  @Input() connectionStatus: string = 'disconnected';

  @Output() toggleCollapse = new EventEmitter<void>();

  /**
   * Get connection status color class
   */
  getStatusClass(): string {
    switch (this.connectionStatus) {
      case 'connected':
        return 'status-connected';
      case 'connecting':
        return 'status-connecting';
      case 'error':
        return 'status-error';
      default:
        return 'status-disconnected';
    }
  }

  /**
   * Get connection status text
   */
  getStatusText(): string {
    switch (this.connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  }
}
