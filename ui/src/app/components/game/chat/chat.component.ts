import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { ChatMessage } from '../../../models/chat.model';

/**
 * Chat command interface
 */
interface ChatCommand {
  name: string;
  description: string;
  syntax?: string;
  execute: (args: string[]) => void;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  chatService = inject(ChatService);

  @ViewChild('messageList') private messageList!: ElementRef;

  // Component state
  isCollapsed = signal(false);
  messageInput = signal('');
  sendingMessage = signal(false);
  errorMessage = signal<string | null>(null);

  // Autocomplete state
  showSuggestions = signal(false);
  commandSuggestions = signal<ChatCommand[]>([]);
  selectedSuggestionIndex = signal(0);

  private shouldScrollToBottom = false;

  // Command registry
  private commands: ChatCommand[] = [
    {
      name: '/help',
      description: 'Show available commands',
      execute: () => this.showHelp()
    },
    {
      name: '/online',
      description: 'Show number of users currently online',
      execute: () => {
        this.chatService.getOnlineCount();
        this.shouldScrollToBottom = true;
      }
    },
    {
      name: '/clear',
      description: 'Clear chat history (local only)',
      execute: () => {
        this.chatService.clearMessages();
        this.addLocalMessage('Chat history cleared');
      }
    }
  ];

  ngOnInit(): void {
    // Chat service auto-connects via effect
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    // Service handles disconnect
  }

  /**
   * Toggle chat collapsed state
   */
  toggleCollapse(): void {
    this.isCollapsed.update(collapsed => !collapsed);
  }

  /**
   * Send a chat message
   */
  async sendMessage(): Promise<void> {
    const message = this.messageInput().trim();

    if (!message) {
      return;
    }

    // Close autocomplete if open
    if (this.showSuggestions()) {
      this.showSuggestions.set(false);
    }

    // Check if message is a command
    if (message.startsWith('/')) {
      this.handleCommand(message);
      this.messageInput.set('');
      return;
    }

    if (message.length > 500) {
      this.errorMessage.set('Message too long (max 500 characters)');
      return;
    }

    this.sendingMessage.set(true);
    this.errorMessage.set(null);

    try {
      await this.chatService.sendMessage(message);
      this.messageInput.set('');
      this.shouldScrollToBottom = true;
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      this.sendingMessage.set(false);
    }
  }

  /**
   * Update message input and filter command suggestions
   */
  onInputChange(): void {
    const input = this.messageInput();

    // Show suggestions if input starts with /
    if (input.startsWith('/')) {
      const filtered = this.commands.filter(cmd =>
        cmd.name.startsWith(input.toLowerCase())
      );
      this.commandSuggestions.set(filtered);
      this.showSuggestions.set(filtered.length > 0);
      this.selectedSuggestionIndex.set(0);
    } else {
      this.showSuggestions.set(false);
      this.commandSuggestions.set([]);
    }
  }

  /**
   * Select a command from autocomplete
   */
  selectSuggestion(index: number): void {
    const suggestions = this.commandSuggestions();
    if (index >= 0 && index < suggestions.length) {
      this.messageInput.set(suggestions[index].name + ' ');
      this.showSuggestions.set(false);
    }
  }

  /**
   * Handle chat commands
   */
  private handleCommand(command: string): void {
    const input = command.toLowerCase().trim();

    // Split command and arguments
    const parts = input.split(' ');
    const cmdName = parts[0];
    const args = parts.slice(1);

    // Find command in registry
    const cmd = this.commands.find(c => c.name === cmdName);

    if (cmd) {
      cmd.execute(args);
      return;
    }

    // Unknown command
    this.addLocalMessage(`Unknown command: ${cmdName}. Type /help for available commands.`);
  }

  /**
   * Show help message with available commands
   */
  private showHelp(): void {
    const helpText = 'Available Commands:\n' +
      this.commands.map(cmd => {
        const syntax = cmd.syntax ? ` ${cmd.syntax}` : '';
        return `${cmd.name}${syntax} - ${cmd.description}`;
      }).join('\n');

    this.addLocalMessage(helpText);
  }

  /**
   * Add a local-only system message
   */
  private addLocalMessage(text: string): void {
    this.chatService.addLocalMessage({
      userId: 'system',
      username: 'System',
      message: text,
      createdAt: new Date()
    });
    this.shouldScrollToBottom = true;
  }

  /**
   * Handle key press in input field
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      // If autocomplete is open, select suggestion
      if (this.showSuggestions()) {
        this.selectSuggestion(this.selectedSuggestionIndex());
      } else {
        this.sendMessage();
      }
    }
  }

  /**
   * Handle key down for autocomplete navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions()) {
      return;
    }

    const suggestions = this.commandSuggestions();
    const currentIndex = this.selectedSuggestionIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < suggestions.length - 1) {
          this.selectedSuggestionIndex.set(currentIndex + 1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          this.selectedSuggestionIndex.set(currentIndex - 1);
        }
        break;

      case 'Tab':
        event.preventDefault();
        this.selectSuggestion(currentIndex);
        break;

      case 'Escape':
        event.preventDefault();
        this.showSuggestions.set(false);
        break;
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

  /**
   * Get connection status color class
   */
  getStatusClass(): string {
    switch (this.chatService.connectionStatus()) {
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
    switch (this.chatService.connectionStatus()) {
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
