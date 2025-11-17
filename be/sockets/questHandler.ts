/**
 * Quest Socket Handler
 *
 * Handles WebSocket events for real-time quest updates.
 * Provides real-time notifications for quest progress, completion, and rewards.
 */

import { Server, Socket } from 'socket.io';
import Player from '../models/Player';
import questService from '../services/questService';

export default function (io: Server) {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    if (!userId) {
      return;
    }

    console.log(`✓ User connected to quest handler: ${userId}`);
  /**
   * quest:accept - Manually accept a quest
   */
  socket.on('quest:accept', async (data: { questId: string }) => {
    try {
      const { questId } = data;

      if (!socket.data.userId) {
        socket.emit('quest:error', { message: 'Not authenticated' });
        return;
      }

      const player = await Player.findOne({ userId: socket.data.userId });
      if (!player) {
        socket.emit('quest:error', { message: 'Player not found' });
        return;
      }

      const result = await questService.acceptQuest(player, questId);

      if (!result.success) {
        socket.emit('quest:error', { message: result.message });
        return;
      }

      socket.emit('quest:accepted', {
        message: result.message,
        quest: result.quest
      });
    } catch (error) {
      console.error('Error accepting quest via socket:', error);
      socket.emit('quest:error', { message: 'Failed to accept quest' });
    }
  });

  /**
   * quest:abandon - Abandon an active quest
   */
  socket.on('quest:abandon', async (data: { questId: string }) => {
    try {
      const { questId } = data;

      if (!socket.data.userId) {
        socket.emit('quest:error', { message: 'Not authenticated' });
        return;
      }

      const player = await Player.findOne({ userId: socket.data.userId });
      if (!player) {
        socket.emit('quest:error', { message: 'Player not found' });
        return;
      }

      const result = await questService.abandonQuest(player, questId);

      if (!result.success) {
        socket.emit('quest:error', { message: result.message });
        return;
      }

      socket.emit('quest:abandoned', {
        message: result.message,
        questId
      });
    } catch (error) {
      console.error('Error abandoning quest via socket:', error);
      socket.emit('quest:error', { message: 'Failed to abandon quest' });
    }
  });

  /**
   * quest:complete - Turn in a completed quest
   */
  socket.on('quest:complete', async (data: { questId: string }) => {
    try {
      const { questId } = data;

      if (!socket.data.userId) {
        socket.emit('quest:error', { message: 'Not authenticated' });
        return;
      }

      const player = await Player.findOne({ userId: socket.data.userId });
      if (!player) {
        socket.emit('quest:error', { message: 'Player not found' });
        return;
      }

      const result = await questService.turnInQuest(player, questId);

      if (!result.success) {
        socket.emit('quest:error', { message: result.message });
        return;
      }

      socket.emit('quest:rewarded', {
        message: result.message,
        questId,
        rewards: result.rewards
      });

      // Also send updated active/completed quest lists
      const activeQuests = questService.getActiveQuests(player);
      const completedQuests = questService.getCompletedQuests(player);

      socket.emit('quest:listsUpdated', {
        active: activeQuests,
        completed: completedQuests
      });
    } catch (error) {
      console.error('Error completing quest via socket:', error);
      socket.emit('quest:error', { message: 'Failed to complete quest' });
    }
  });

  /**
   * quest:getStatus - Get current quest status
   */
  socket.on('quest:getStatus', async () => {
    try {
      if (!socket.data.userId) {
        socket.emit('quest:error', { message: 'Not authenticated' });
        return;
      }

      const player = await Player.findOne({ userId: socket.data.userId });
      if (!player) {
        socket.emit('quest:error', { message: 'Player not found' });
        return;
      }

      const activeQuests = questService.getActiveQuests(player);
      const completedQuests = questService.getCompletedQuests(player);
      const availableQuests = questService.getAvailableQuests(player);

      socket.emit('quest:status', {
        active: activeQuests,
        completed: completedQuests,
        available: availableQuests
      });
    } catch (error) {
      console.error('Error getting quest status via socket:', error);
      socket.emit('quest:error', { message: 'Failed to get quest status' });
    }
  });

    /**
     * Event: disconnect
     * User disconnects
     */
    socket.on('disconnect', (reason: string) => {
      console.log(`✗ User disconnected from quest handler: ${userId} (${reason})`);
    });
  });
}
