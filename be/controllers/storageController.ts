import { Request, Response } from 'express';
import Player from '../models/Player';
import storageService from '../services/storageService';
import playerStorageService from '../services/playerStorageService';
import { AuthenticatedRequest } from '../types/express';

/**
 * Get storage container information and items
 * GET /api/storage/items/:containerId
 */
export const getStorageItems = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { containerId } = req.params;

    const player = await Player.findOne({ userId });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const containerInfo = storageService.getContainerInfo(player, containerId);

    res.json({
      message: 'Storage items retrieved successfully',
      container: containerInfo
    });
  } catch (error: any) {
    console.error('Error getting storage items:', error);
    res.status(500).json({
      message: 'Failed to get storage items',
      error: error.message
    });
  }
};

/**
 * Deposit item from inventory to storage container
 * POST /api/storage/deposit
 * Body: { containerId: string, instanceId: string, quantity?: number | null }
 */
export const depositItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { containerId, instanceId, quantity = null } = req.body;

    if (!containerId) {
      return res.status(400).json({ message: 'containerId is required' });
    }

    if (!instanceId) {
      return res.status(400).json({ message: 'instanceId is required' });
    }

    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Process deposit
    const result = await storageService.processDeposit(player, containerId, instanceId, quantity);

    // Get updated container info
    const containerInfo = storageService.getContainerInfo(player, containerId);

    res.json({
      message: `Deposited ${result.depositQuantity}x ${result.itemId} to storage`,
      deposited: result,
      container: containerInfo
    });
  } catch (error: any) {
    console.error('Error depositing item:', error);
    res.status(400).json({
      message: 'Failed to deposit item',
      error: error.message
    });
  }
};

/**
 * Withdraw item from storage container to inventory
 * POST /api/storage/withdraw
 * Body: { containerId: string, instanceId: string, quantity?: number | null }
 */
export const withdrawItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { containerId, instanceId, quantity = null } = req.body;

    if (!containerId) {
      return res.status(400).json({ message: 'containerId is required' });
    }

    if (!instanceId) {
      return res.status(400).json({ message: 'instanceId is required' });
    }

    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Process withdrawal
    const result = await storageService.processWithdraw(player, containerId, instanceId, quantity);

    // Get updated container info
    const containerInfo = storageService.getContainerInfo(player, containerId);

    res.json({
      message: `Withdrew ${result.withdrawQuantity}x ${result.itemId} from storage`,
      withdrawn: result,
      container: containerInfo
    });
  } catch (error: any) {
    console.error('Error withdrawing item:', error);
    res.status(400).json({
      message: 'Failed to withdraw item',
      error: error.message
    });
  }
};

/**
 * Get storage container capacity information
 * GET /api/storage/capacity/:containerId
 */
export const getStorageCapacity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { containerId } = req.params;

    const player = await Player.findOne({ userId });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const container = playerStorageService.getContainer(player, containerId);

    res.json({
      capacity: container.capacity,
      usedSlots: container.items.length,
      availableSlots: container.capacity - container.items.length
    });
  } catch (error: any) {
    console.error('Error getting storage capacity:', error);
    res.status(500).json({
      message: 'Failed to get storage capacity',
      error: error.message
    });
  }
};

/**
 * Legacy endpoint - Get bank information and items (backward compatibility)
 * GET /api/storage/bank/items
 */
export const getBankItems = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const player = await Player.findOne({ userId });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const bankInfo = storageService.getBankInfo(player);

    res.json({
      message: 'Bank items retrieved successfully',
      bank: bankInfo
    });
  } catch (error: any) {
    console.error('Error getting bank items:', error);
    res.status(500).json({
      message: 'Failed to get bank items',
      error: error.message
    });
  }
};
