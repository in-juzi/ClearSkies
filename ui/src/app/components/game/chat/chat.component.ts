import { Component, OnInit, OnDestroy, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../services/chat.service';
import { InventoryService } from '../../../services/inventory.service';
import { ChatMessage } from '../../../models/chat.model';
import { AddItemRequest } from '../../../models/inventory.model';
import { MessageFormatPipe } from '../../../pipes/message-format.pipe';

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
  imports: [CommonModule, FormsModule, MessageFormatPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  chatService = inject(ChatService);
  inventoryService = inject(InventoryService);

  @ViewChild('messageList') private messageList!: ElementRef;

  // Component state
  isCollapsed = signal(true);
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
    },
    {
      name: '/additem',
      description: 'Add item to inventory',
      syntax: '[itemId] [quantity] [modifiers]',
      execute: (args: string[]) => {
        if (args.length === 0) {
          this.addLocalMessage('Usage: /additem [itemId] [quantity] [modifiers]\\nExample: /additem oak_log 10 moisture:3,age:2\\nUse /listitems to see available items');
          return;
        }
        const itemId = args[0];
        const quantity = parseInt(args[1]) || 1;
        const modifiers = args.slice(2).join(' ');
        this.addItemViaCommand(itemId, quantity, modifiers);
      }
    },
    {
      name: '/listitems',
      description: 'Show available items and modifier syntax',
      execute: () => this.showItemList()
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
   * Parse item modifiers from command arguments
   * Format: quality:level,trait:level (e.g., "moisture:3,age:2,pristine:1")
   */
  private parseItemModifiers(modifiers: string): { qualities?: { [key: string]: number }, traits?: { [key: string]: number } } {
    const result: { qualities?: { [key: string]: number }, traits?: { [key: string]: number } } = {};

    if (!modifiers || !modifiers.trim()) {
      return result;
    }

    // Known quality and trait types for validation
    const knownQualities = ['woodGrain', 'moisture', 'age', 'purity', 'sheen'];
    const knownTraits = ['fragrant', 'knotted', 'weathered', 'pristine', 'cursed', 'blessed', 'masterwork'];

    const pairs = modifiers.split(',');

    for (const pair of pairs) {
      const [key, value] = pair.trim().split(':');

      if (!key || !value) {
        continue;
      }

      const level = parseInt(value);
      if (isNaN(level)) {
        continue;
      }

      // Determine if it's a quality or trait
      if (knownQualities.includes(key)) {
        if (level >= 1 && level <= 5) {
          if (!result.qualities) result.qualities = {};
          result.qualities[key] = level;
        }
      } else if (knownTraits.includes(key)) {
        if (level >= 1 && level <= 3) {
          if (!result.traits) result.traits = {};
          result.traits[key] = level;
        }
      }
    }

    return result;
  }

  /**
   * Add item to inventory via command
   */
  private addItemViaCommand(itemId: string, quantity: number, modifiers?: string): void {
    const request: AddItemRequest = {
      itemId,
      quantity: quantity || 1
    };

    // Parse modifiers if provided
    if (modifiers) {
      const parsed = this.parseItemModifiers(modifiers);
      if (parsed.qualities && Object.keys(parsed.qualities).length > 0) {
        request.qualities = parsed.qualities;
      }
      if (parsed.traits && Object.keys(parsed.traits).length > 0) {
        request.traits = parsed.traits;
      }
    }

    this.inventoryService.addItem(request).subscribe({
      next: (response) => {
        let message = `✓ Added ${quantity}x ${itemId}`;
        if (request.qualities || request.traits) {
          const mods: string[] = [];
          if (request.qualities) {
            mods.push(...Object.entries(request.qualities).map(([k, v]) => `${k}:${v}`));
          }
          if (request.traits) {
            mods.push(...Object.entries(request.traits).map(([k, v]) => `${k}:${v}`));
          }
          message += ` (${mods.join(', ')})`;
        }
        this.addLocalMessage(message);
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Failed to add item';
        this.addLocalMessage(`✗ Error: ${errorMsg}`);
      }
    });
  }

  /**
   * Show list of available items
   */
  private showItemList(): void {
    // Show loading message
    this.addLocalMessage('Loading item list...');

    this.inventoryService.getItemDefinitions().subscribe({
      next: (response) => {
        // Group items by category
        const byCategory: { [key: string]: string[] } = {};

        response.items.forEach(item => {
          const category = item.category || 'other';
          if (!byCategory[category]) {
            byCategory[category] = [];
          }
          byCategory[category].push(item.itemId);
        });

        // Format help text with items grouped by category
        let helpText = `Available Items (${response.items.length} total):\\n\\n`;

        // Sort categories for consistent display
        const categoryOrder = ['resource', 'equipment', 'consumable'];
        const sortedCategories = Object.keys(byCategory).sort((a, b) => {
          const aIndex = categoryOrder.indexOf(a);
          const bIndex = categoryOrder.indexOf(b);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.localeCompare(b);
        });

        sortedCategories.forEach(category => {
          const itemIds = byCategory[category];
          const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
          helpText += `**${capitalizedCategory}** (${itemIds.length}): ${itemIds.join(', ')}\\n\\n`;
        });

        helpText += '\\n**Usage**: /additem [itemId] [quantity] [modifiers]\\n';
        helpText += '**Modifiers**: quality:level,trait:level\\n';
        helpText += '**Qualities**: woodGrain, moisture, age, purity, sheen (levels 1-5)\\n';
        helpText += '**Traits**: fragrant, knotted, weathered, pristine, cursed, blessed, masterwork (levels 1-3)';

        this.addLocalMessage(helpText);
      },
      error: (error) => {
        console.error('Failed to load item definitions:', error);
        this.addLocalMessage('✗ Error: Failed to load item list. Please try again.');
      }
    });
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
