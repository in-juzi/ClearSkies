import { Server, Socket } from 'socket.io';
import Player from '../models/Player';
import storageService from '../services/storageService';

/**
 * Storage Socket Handler
 * Handles real-time storage operations (deposit, withdraw, bulk operations)
 * Supports bank, guild storage, and player housing containers
 */
export default function storageHandler(io: Server): void {
  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;

    if (!userId) {
      return; // Not authenticated
    }

    /**
     * Get storage container items
     * Event: storage:getItems
     * Payload: { containerId: string }
     */
    socket.on('storage:getItems', async (data: { containerId: string }) => {
      try {
        const { containerId } = data;

        const player = await Player.findOne({ userId });
        if (!player) {
          socket.emit('storage:error', { message: 'Player not found' });
          return;
        }

        const containerInfo = storageService.getContainerInfo(player, containerId);

        socket.emit('storage:items', {
          containerId,
          containerType: containerInfo.containerType,
          name: containerInfo.name,
          capacity: containerInfo.capacity,
          usedSlots: containerInfo.usedSlots,
          items: containerInfo.items
        });
      } catch (error: any) {
        console.error('Error getting storage items:', error);
        socket.emit('storage:error', {
          message: 'Failed to get storage items',
          error: error.message
        });
      }
    });

    /**
     * Deposit item to storage container
     * Event: storage:deposit
     * Payload: { containerId: string, instanceId: string, quantity?: number | null }
     */
    socket.on('storage:deposit', async (data: { containerId: string; instanceId: string; quantity?: number | null }) => {
      try {
        const { containerId, instanceId, quantity = null } = data;

        const player = await Player.findOne({ userId });
        if (!player) {
          socket.emit('storage:error', { message: 'Player not found' });
          return;
        }

        // Process deposit
        const result = await storageService.processDeposit(player, containerId, instanceId, quantity);

        // Get updated container info
        const containerInfo = storageService.getContainerInfo(player, containerId);

        // Emit success to depositing player
        socket.emit('storage:deposited', {
          containerId,
          depositedItem: result,
          container: containerInfo
        });

        // Emit update to other players viewing the same container (for guild storage)
        socket.to(`storage:${containerId}`).emit('storage:itemAdded', {
          containerId,
          item: result.item,
          userId
        });
      } catch (error: any) {
        console.error('Error depositing item:', error);
        socket.emit('storage:error', {
          message: 'Failed to deposit item',
          error: error.message
        });
      }
    });

    /**
     * Withdraw item from storage container
     * Event: storage:withdraw
     * Payload: { containerId: string, instanceId: string, quantity?: number | null }
     */
    socket.on('storage:withdraw', async (data: { containerId: string; instanceId: string; quantity?: number | null }) => {
      try {
        const { containerId, instanceId, quantity = null } = data;

        const player = await Player.findOne({ userId });
        if (!player) {
          socket.emit('storage:error', { message: 'Player not found' });
          return;
        }

        // Process withdrawal
        const result = await storageService.processWithdraw(player, containerId, instanceId, quantity);

        // Get updated container info
        const containerInfo = storageService.getContainerInfo(player, containerId);

        // Emit success to withdrawing player
        socket.emit('storage:withdrawn', {
          containerId,
          withdrawnItem: result,
          container: containerInfo
        });

        // Emit update to other players viewing the same container (for guild storage)
        socket.to(`storage:${containerId}`).emit('storage:itemRemoved', {
          containerId,
          instanceId,
          quantity: result.withdrawQuantity,
          userId
        });
      } catch (error: any) {
        console.error('Error withdrawing item:', error);
        socket.emit('storage:error', {
          message: 'Failed to withdraw item',
          error: error.message
        });
      }
    });

    /**
     * Bulk deposit items to storage container
     * Event: storage:bulkDeposit
     * Payload: { containerId: string, items: [{ instanceId: string, quantity?: number | null }] }
     */
    socket.on('storage:bulkDeposit', async (data: { containerId: string; items: Array<{ instanceId: string; quantity?: number | null }> }) => {
      try {
        const { containerId, items } = data;

        const player = await Player.findOne({ userId });
        if (!player) {
          socket.emit('storage:error', { message: 'Player not found' });
          return;
        }

        const results: any[] = [];
        const errors: any[] = [];

        // Process each deposit
        for (const item of items) {
          try {
            const result = await storageService.processDeposit(player, containerId, item.instanceId, item.quantity ?? null);
            results.push(result);
          } catch (error: any) {
            errors.push({
              instanceId: item.instanceId,
              error: error.message
            });
          }
        }

        // Get updated container info
        const containerInfo = storageService.getContainerInfo(player, containerId);

        // Emit success
        socket.emit('storage:bulkDeposited', {
          containerId,
          deposited: results,
          errors,
          container: containerInfo
        });

        // Emit update to other players viewing the same container
        if (results.length > 0) {
          socket.to(`storage:${containerId}`).emit('storage:bulkUpdate', {
            containerId,
            userId,
            action: 'deposit',
            count: results.length
          });
        }
      } catch (error: any) {
        console.error('Error bulk depositing items:', error);
        socket.emit('storage:error', {
          message: 'Failed to bulk deposit items',
          error: error.message
        });
      }
    });

    /**
     * Join storage container room (for real-time updates)
     * Event: storage:join
     * Payload: { containerId: string }
     */
    socket.on('storage:join', async (data: { containerId: string }) => {
      try {
        const { containerId } = data;

        // Validate player has access to this container
        const player = await Player.findOne({ userId });
        if (!player) {
          socket.emit('storage:error', { message: 'Player not found' });
          return;
        }

        // TODO: Add permission check here when implementing guild storage
        // For now, just check if container exists
        try {
          player.getContainer(containerId);
        } catch (error) {
          socket.emit('storage:error', { message: 'Container not found or access denied' });
          return;
        }

        // Join the room
        socket.join(`storage:${containerId}`);

        socket.emit('storage:joined', { containerId });
      } catch (error: any) {
        console.error('Error joining storage room:', error);
        socket.emit('storage:error', {
          message: 'Failed to join storage room',
          error: error.message
        });
      }
    });

    /**
     * Leave storage container room
     * Event: storage:leave
     * Payload: { containerId: string }
     */
    socket.on('storage:leave', (data: { containerId: string }) => {
      const { containerId } = data;
      socket.leave(`storage:${containerId}`);
      socket.emit('storage:left', { containerId });
    });
  });
}
