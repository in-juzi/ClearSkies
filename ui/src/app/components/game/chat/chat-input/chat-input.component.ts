import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Chat command interface
 */
export interface ChatCommand {
  name: string;
  description: string;
  syntax?: string;
}

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Input() connectionStatus: string = 'disconnected';
  @Input() errorMessage: string | null = null;
  @Input() showSuggestions: boolean = false;
  @Input() commandSuggestions: ChatCommand[] = [];
  @Input() selectedSuggestionIndex: number = 0;
  @Input() sendingMessage: boolean = false;

  @Output() inputChange = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<void>();
  @Output() selectSuggestion = new EventEmitter<number>();
  @Output() keyPress = new EventEmitter<KeyboardEvent>();
  @Output() keyDown = new EventEmitter<KeyboardEvent>();

  messageInput = signal('');

  /**
   * Handle input changes
   */
  onInputChange(): void {
    this.inputChange.emit(this.messageInput());
  }

  /**
   * Handle send button click
   */
  onSend(): void {
    this.sendMessage.emit();
  }

  /**
   * Handle suggestion selection
   */
  onSelectSuggestion(index: number): void {
    this.selectSuggestion.emit(index);
  }

  /**
   * Handle key press events
   */
  onKeyPress(event: KeyboardEvent): void {
    this.keyPress.emit(event);
  }

  /**
   * Handle key down events
   */
  onKeyDown(event: KeyboardEvent): void {
    this.keyDown.emit(event);
  }
}
