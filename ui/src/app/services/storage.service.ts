import { Injectable, signal, inject, effect } from '@angular/core';
import { SocketService } from './socket.service';
import { ItemDetails } from '../models/inventory.model';

export interface StorageContainerInfo {
  containerId: string;
  containerType: string;
  name: string;
  capacity: number;
  usedSlots: number;
  items: ItemDetails[];
}

export interface StorageDepositedEvent {
  containerId: string;
  depositedItem: any;
  container: StorageContainerInfo;
}

export interface StorageWithdrawnEvent {
  containerId: string;
  withdrawnItem: any;
  container: StorageContainerInfo;
}

export interface StorageBulkDepositedEvent {
  containerId: string;
  deposited: any[];
  errors: any[];
  container: StorageContainerInfo;
}

export interface StorageItemAddedEvent {
  containerId: string;
  item: ItemDetails;
  userId: string;
}

export interface StorageItemRemovedEvent {
  containerId: string;
  instanceId: string;
  quantity: number;
  userId: string;
}

export interface StorageBulkUpdateEvent {
  containerId: string;
  userId: string;
  action: 'deposit' | 'withdraw';
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private socketService = inject(SocketService);

  // Signals for reactive state
  containerItems = signal<ItemDetails[]>([]);
  containerCapacity = signal<number>(200);
  containerUsedSlots = signal<number>(0);
  containerAvailableSlots = signal<number>(200);
  containerName = signal<string>('Storage');
  containerType = signal<string>('bank');
  currentContainerId = signal<string | null>(null);
  isOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    // Setup listeners when socket connects
    effect(() => {
      if (this.socketService.isConnected()) {
        this.setupSocketListeners();
      }
    });
  }

  /**
   * Setup WebSocket event listeners
   */
  private setupSocketListeners(): void {
    const socket = this.socketService.getSocket();
    if (!socket) return;

    // Container items response
    socket.on('storage:items', (data: {
      containerId: string;
      containerType: string;
      name: string;
      capacity: number;
      usedSlots: number;
      items: ItemDetails[];
    }) => {
      this.containerItems.set(data.items);
      this.containerCapacity.set(data.capacity);
      this.containerUsedSlots.set(data.usedSlots);
      this.containerAvailableSlots.set(data.capacity - data.usedSlots);
      this.containerName.set(data.name);
      this.containerType.set(data.containerType);
      this.currentContainerId.set(data.containerId);
      this.isLoading.set(false);
    });

    // Deposit success
    socket.on('storage:deposited', (data: StorageDepositedEvent) => {
      this.containerItems.set(data.container.items);
      this.containerUsedSlots.set(data.container.usedSlots);
      this.containerAvailableSlots.set(data.container.capacity - data.container.usedSlots);
      this.isLoading.set(false);
    });

    // Withdraw success
    socket.on('storage:withdrawn', (data: StorageWithdrawnEvent) => {
      this.containerItems.set(data.container.items);
      this.containerUsedSlots.set(data.container.usedSlots);
      this.containerAvailableSlots.set(data.container.capacity - data.container.usedSlots);
      this.isLoading.set(false);
    });

    // Bulk deposit success
    socket.on('storage:bulkDeposited', (data: StorageBulkDepositedEvent) => {
      this.containerItems.set(data.container.items);
      this.containerUsedSlots.set(data.container.usedSlots);
      this.containerAvailableSlots.set(data.container.capacity - data.container.usedSlots);
      this.isLoading.set(false);

      // Log any errors
      if (data.errors.length > 0) {
        console.warn('Bulk deposit had errors:', data.errors);
      }
    });

    // Real-time updates from other users (for guild storage)
    socket.on('storage:itemAdded', (data: StorageItemAddedEvent) => {
      // Only update if we're viewing the same container
      if (this.currentContainerId() === data.containerId) {
        // Refresh the container items
        this.getContainerItems(data.containerId);
      }
    });

    socket.on('storage:itemRemoved', (data: StorageItemRemovedEvent) => {
      // Only update if we're viewing the same container
      if (this.currentContainerId() === data.containerId) {
        // Refresh the container items
        this.getContainerItems(data.containerId);
      }
    });

    socket.on('storage:bulkUpdate', (data: StorageBulkUpdateEvent) => {
      // Only update if we're viewing the same container
      if (this.currentContainerId() === data.containerId) {
        // Refresh the container items
        this.getContainerItems(data.containerId);
      }
    });

    // Error handling
    socket.on('storage:error', (data: { message: string; error?: string }) => {
      this.error.set(data.error || data.message);
      this.isLoading.set(false);
      console.error('Storage error:', data);
    });

    // Join/leave room confirmations
    socket.on('storage:joined', (data: { containerId: string }) => {
      console.log('Joined storage room:', data.containerId);
    });

    socket.on('storage:left', (data: { containerId: string }) => {
      console.log('Left storage room:', data.containerId);
    });
  }

  /**
   * Get items in a storage container
   */
  getContainerItems(containerId: string): void {
    const socket = this.socketService.getSocket();
    if (!socket) return;

    this.isLoading.set(true);
    this.error.set(null);
    socket.emit('storage:getItems', { containerId });
  }

  /**
   * Deposit item to storage container
   */
  depositItem(containerId: string, instanceId: string, quantity?: number | null): void {
    const socket = this.socketService.getSocket();
    if (!socket) return;

    this.isLoading.set(true);
    this.error.set(null);
    socket.emit('storage:deposit', {
      containerId,
      instanceId,
      quantity: quantity ?? null
    });
  }

  /**
   * Withdraw item from storage container
   */
  withdrawItem(containerId: string, instanceId: string, quantity?: number | null): void {
    const socket = this.socketService.getSocket();
    if (!socket) return;

    this.isLoading.set(true);
    this.error.set(null);
    socket.emit('storage:withdraw', {
      containerId,
      instanceId,
      quantity: quantity ?? null
    });
  }

  /**
   * Bulk deposit multiple items to storage container
   */
  bulkDeposit(containerId: string, items: Array<{ instanceId: string; quantity?: number | null }>): void {
    const socket = this.socketService.getSocket();
    if (!socket) return;

    this.isLoading.set(true);
    this.error.set(null);
    socket.emit('storage:bulkDeposit', {
      containerId,
      items
    });
  }

  /**
   * Join a storage container room for real-time updates
   */
  joinContainer(containerId: string): void {
    const socket = this.socketService.getSocket();
    if (!socket) return;

    socket.emit('storage:join', { containerId });
  }

  /**
   * Leave a storage container room
   */
  leaveContainer(containerId: string): void {
    const socket = this.socketService.getSocket();
    if (!socket) return;

    socket.emit('storage:leave', { containerId });
  }

  /**
   * Open storage UI for a specific container
   */
  openStorage(containerId: string): void {
    this.isOpen.set(true);
    this.currentContainerId.set(containerId);
    this.joinContainer(containerId);
    this.getContainerItems(containerId);
  }

  /**
   * Close storage UI
   */
  closeStorage(): void {
    const containerId = this.currentContainerId();
    if (containerId) {
      this.leaveContainer(containerId);
    }
    this.isOpen.set(false);
    this.currentContainerId.set(null);
    this.containerItems.set([]);
  }

  /**
   * Toggle storage UI
   */
  toggleStorage(containerId: string): void {
    if (this.isOpen() && this.currentContainerId() === containerId) {
      this.closeStorage();
    } else {
      this.openStorage(containerId);
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error.set(null);
  }
}
