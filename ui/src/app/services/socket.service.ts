import { Injectable, signal, effect, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private authService = inject(AuthService);

  // Private socket signal
  private socketSignal = signal<Socket | null>(null);

  // Public readonly signals
  readonly isConnected = signal(false);
  readonly connectionStatus = signal<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');
  readonly errorMessage = signal<string | null>(null);

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
      console.error('No auth token found for socket connection');
      return;
    }

    this.connectionStatus.set('connecting');

    // Socket.io connects to base URL (not /api path)
    // Remove '/api' suffix to get the base server URL
    let baseUrl = environment.apiUrl;
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.slice(0, -4); // Remove last 4 characters ('/api')
    }

    // Debug logging
    console.log('Environment apiUrl:', environment.apiUrl);
    console.log('Socket.io connecting to:', baseUrl);

    const socket = io(baseUrl, {
      auth: { token },
      transports: ['polling', 'websocket'], // Try polling first
      path: '/socket.io/'
    });

    // Connection events
    socket.on('connect', () => {
      console.log('✓ Connected to game server (Socket.io)');
      this.connectionStatus.set('connected');
      this.isConnected.set(true);
      this.errorMessage.set(null);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.connectionStatus.set('error');
      this.isConnected.set(false);
      this.errorMessage.set(error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('✗ Disconnected from game server:', reason);
      this.connectionStatus.set('disconnected');
      this.isConnected.set(false);

      // Auto-reconnect on unexpected disconnect
      if (reason === 'io server disconnect') {
        socket.connect();
      }
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
      this.connectionStatus.set('disconnected');
      this.isConnected.set(false);
    }
  }

  /**
   * Get the socket instance (for direct event handling)
   */
  getSocket(): Socket | null {
    return this.socketSignal();
  }

  /**
   * Emit an event and return a Promise with the callback response
   */
  emit<T = any>(event: string, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const socket = this.socketSignal();
      if (!socket) {
        reject({ success: false, message: 'Not connected to server' });
        return;
      }

      socket.emit(event, data, (response: T) => {
        resolve(response);
      });
    });
  }

  /**
   * Listen to an event
   */
  on<T = any>(event: string, callback: (data: T) => void): void {
    const socket = this.socketSignal();
    if (socket) {
      socket.on(event, callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    const socket = this.socketSignal();
    if (socket) {
      socket.off(event, callback);
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    const socket = this.socketSignal();
    if (socket) {
      socket.removeAllListeners(event);
    }
  }
}
