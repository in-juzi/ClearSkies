import { Injectable, signal, effect, inject } from '@angular/core';
import { ChatMessage, ChatHistoryResponse, SendMessageResponse, ConnectionStatus } from '../models/chat.model';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socketService = inject(SocketService);

  // Private signals for internal state
  private messagesSignal = signal<ChatMessage[]>([]);

  // Public readonly signals
  readonly messages = this.messagesSignal.asReadonly();
  readonly connectionStatus = this.socketService.connectionStatus;
  readonly errorMessage = this.socketService.errorMessage;
  readonly isConnected = this.socketService.isConnected;

  constructor() {
    // Set up chat event listener
    effect(() => {
      if (this.socketService.isConnected()) {
        this.setupChatListeners();
      }
    });
  }

  /**
   * Set up chat event listeners
   */
  private setupChatListeners(): void {
    // Chat message event
    this.socketService.on<ChatMessage>('chat:message', (message: ChatMessage) => {
      this.messagesSignal.update(messages => [...messages, message]);
    });
  }

  /**
   * Load chat history from server
   */
  async loadHistory(limit: number = 50): Promise<void> {
    try {
      const response = await this.socketService.emit<ChatHistoryResponse>('chat:getHistory', { limit });
      if (response.success && response.messages) {
        this.messagesSignal.set(response.messages);
      } else {
        console.error('Failed to load chat history:', response.message);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  /**
   * Send a chat message
   */
  async sendMessage(message: string): Promise<SendMessageResponse> {
    if (!message || message.trim().length === 0) {
      throw { success: false, message: 'Message cannot be empty' };
    }

    if (message.length > 500) {
      throw { success: false, message: 'Message too long (max 500 characters)' };
    }

    const response = await this.socketService.emit<SendMessageResponse>('chat:sendMessage', { message });

    if (!response.success) {
      throw response;
    }

    return response;
  }

  /**
   * Get number of messages
   */
  getMessageCount(): number {
    return this.messagesSignal().length;
  }

  /**
   * Clear all messages (local only)
   */
  clearMessages(): void {
    this.messagesSignal.set([]);
  }

  /**
   * Add a local-only message (not broadcasted to other users)
   */
  addLocalMessage(message: ChatMessage): void {
    this.messagesSignal.update(messages => [...messages, message]);
  }

  /**
   * Get online user count from server
   */
  async getOnlineCount(): Promise<void> {
    try {
      const response = await this.socketService.emit<{ success: boolean; count?: number; message?: string }>('chat:getOnlineCount', {});

      if (response.success && response.count !== undefined) {
        const count = response.count;
        const plural = count === 1 ? 'user' : 'users';
        this.addLocalMessage({
          userId: 'system',
          username: 'System',
          message: `${count} ${plural} currently online`,
          createdAt: new Date()
        });
      } else {
        this.addLocalMessage({
          userId: 'system',
          username: 'System',
          message: response.message || 'Failed to get online count',
          createdAt: new Date()
        });
      }
    } catch (error) {
      this.addLocalMessage({
        userId: 'system',
        username: 'System',
        message: 'Not connected to chat',
        createdAt: new Date()
      });
    }
  }

  /**
   * Get socket for backward compatibility
   */
  getSocket() {
    return this.socketService.getSocket();
  }
}
