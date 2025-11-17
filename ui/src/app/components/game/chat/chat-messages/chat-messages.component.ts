import { Component, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../../models/chat.model';
import { MessageFormatPipe } from '../../../../pipes/message-format.pipe';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [CommonModule, MessageFormatPipe],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss'
})
export class ChatMessagesComponent implements AfterViewChecked {
  @Input() messages: ChatMessage[] = [];
  @Input() shouldScrollToBottom: boolean = false;

  @ViewChild('messageList') private messageList!: ElementRef;

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  /**
   * Format timestamp for display
   */
  formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  /**
   * Check if message is from current user
   */
  isOwnMessage(message: ChatMessage): boolean {
    // You can compare with current user's ID if available
    // For now, just return false (all messages appear as others')
    return false;
  }

  /**
   * Scroll message list to bottom
   */
  private scrollToBottom(): void {
    try {
      if (this.messageList) {
        const element = this.messageList.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
