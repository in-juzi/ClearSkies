import { Injectable, signal, effect, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ChatHistoryResponse, SendMessageResponse, ConnectionStatus } from '../models/chat.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private authService = inject(AuthService);

  // Private signals for internal state
  private socketSignal = signal<Socket | null>(null);
  private messagesSignal = signal<ChatMessage[]>([]);
  private connectionStatusSignal = signal<ConnectionStatus>('disconnected');
  private errorMessageSignal = signal<string | null>(null);

  // Public readonly signals
  readonly messages = this.messagesSignal.asReadonly();
  readonly connectionStatus = this.connectionStatusSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();
  readonly isConnected = signal(false);

  constructor() {
    // Auto-connect when user is authenticated
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  /**
   * Connect to Socket.io server
   */
  connect(): void {
    // Don't reconnect if already connected
    if (this.socketSignal()) {
      return;
    }

    const token = localStorage.getItem('clearskies_token');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    this.connectionStatusSignal.set('connecting');

    // Socket.io connects to base URL (not /api path)
    const baseUrl = environment.apiUrl.replace('/api', '');
    const socket = io(baseUrl, {
      auth: { token }
    });

    // Connection events
    socket.on('connect', () => {
      console.log('✓ Connected to chat server');
      this.connectionStatusSignal.set('connected');
      this.isConnected.set(true);
      this.errorMessageSignal.set(null);

      // Don't load history - users only see messages from when they connect
    });

    socket.on('connect_error', (error) => {
      console.error('Chat connection error:', error.message);
      this.connectionStatusSignal.set('error');
      this.isConnected.set(false);
      this.errorMessageSignal.set(error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('✗ Disconnected from chat:', reason);
      this.connectionStatusSignal.set('disconnected');
      this.isConnected.set(false);

      // Auto-reconnect on unexpected disconnect
      if (reason === 'io server disconnect') {
        // Server disconnected us, try reconnecting
        socket.connect();
      }
    });

    // Chat message event
    socket.on('chat:message', (message: ChatMessage) => {
      this.messagesSignal.update(messages => [...messages, message]);
    });

    this.socketSignal.set(socket);
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect(): void {
    const socket = this.socketSignal();
    if (socket) {
      socket.disconnect();
      this.socketSignal.set(null);
      this.connectionStatusSignal.set('disconnected');
      this.isConnected.set(false);
      this.messagesSignal.set([]);
    }
  }

  /**
   * Load chat history from server
   */
  loadHistory(limit: number = 50): void {
    const socket = this.socketSignal();
    if (!socket) {
      console.error('Socket not connected');
      return;
    }

    socket.emit('chat:getHistory', { limit }, (response: ChatHistoryResponse) => {
      if (response.success && response.messages) {
        this.messagesSignal.set(response.messages);
      } else {
        console.error('Failed to load chat history:', response.message);
      }
    });
  }

  /**
   * Send a chat message
   */
  sendMessage(message: string): Promise<SendMessageResponse> {
    return new Promise((resolve, reject) => {
      const socket = this.socketSignal();
      if (!socket) {
        reject({ success: false, message: 'Not connected to chat' });
        return;
      }

      if (!message || message.trim().length === 0) {
        reject({ success: false, message: 'Message cannot be empty' });
        return;
      }

      if (message.length > 500) {
        reject({ success: false, message: 'Message too long (max 500 characters)' });
        return;
      }

      socket.emit('chat:sendMessage', { message }, (response: SendMessageResponse) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
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
  getOnlineCount(): void {
    const socket = this.socketSignal();
    if (!socket) {
      this.addLocalMessage({
        userId: 'system',
        username: 'System',
        message: 'Not connected to chat',
        createdAt: new Date()
      });
      return;
    }

    socket.emit('chat:getOnlineCount', (response: { success: boolean; count?: number; message?: string }) => {
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
    });
  }
}
