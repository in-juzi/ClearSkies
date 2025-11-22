/**
 * Construction Socket Handler
 * Handles real-time construction project events
 */

import { Server, Socket } from 'socket.io';
import Player, { IPlayer } from '../models/Player';
import constructionService from '../services/constructionService';
import propertyService from '../services/propertyService';
import { PropertyTier } from '../models/Property';

export default function constructionHandler(io: Server) {
  io.on('connection', (socket: Socket) => {
    const player = socket.data.player as IPlayer;

  /**
   * Browse active construction projects at a location
   */
  socket.on('construction:browseProjects', async (data, callback) => {
    try {
      const { locationId } = data;

      if (!locationId) {
        return callback?.({ error: 'locationId is required' });
      }

      const projects = await constructionService.getActiveProjectsAtLocation(locationId);

      // Convert to plain objects and handle Maps
      const plainProjects = projects.map(p => {
        const obj = p.toObject();
        if (obj.requiredMaterials instanceof Map) {
          obj.requiredMaterials = Object.fromEntries(obj.requiredMaterials);
        }
        if (obj.contributors instanceof Map) {
          obj.contributors = Object.fromEntries(obj.contributors);
        }
        return obj;
      });

      callback?.({ projects: plainProjects });
    } catch (error: any) {
      console.error('Error browsing projects:', error);
      callback?.({ error: error.message || 'Failed to browse projects' });
    }
  });

  /**
   * Create a new construction project
   */
  socket.on('construction:createProject', async (data, callback) => {
    let project: any = null;
    let goldDeducted = false;
    let savedPlayer: IPlayer | null = null;

    try {
      const { projectType, tier, location, propertyId, roomType } = data;

      if (!projectType || !location) {
        return callback?.({ error: 'projectType and location are required' });
      }

      // Refresh player data from database to ensure we have latest skill levels
      const freshPlayer = await Player.findById(player._id);
      if (!freshPlayer) {
        return callback?.({ error: 'Player not found' });
      }

      if (projectType === 'house') {
        if (!tier) {
          return callback?.({ error: 'tier is required for house projects' });
        }

        // Create house project (validates requirements but doesn't deduct gold)
        project = await constructionService.createHouseProject(freshPlayer, tier as PropertyTier, location);

        // Pay for the plot - critical transaction point
        await constructionService.payProjectGold(project, freshPlayer);
        goldDeducted = true;

      } else if (projectType === 'room') {
        if (!propertyId || !roomType) {
          return callback?.({ error: 'propertyId and roomType are required for room projects' });
        }

        // Create room project
        project = await constructionService.createRoomProject(freshPlayer, propertyId, roomType, location);

      } else {
        return callback?.({ error: 'Invalid project type' });
      }

      // Add player to active construction projects
      if (!player.activeConstructionProjects.includes(project.projectId)) {
        player.activeConstructionProjects.push(project.projectId);
        await player.save();
        savedPlayer = player;
      }

      // Convert to plain object
      const plainProject = project.toObject();
      if (plainProject.requiredMaterials instanceof Map) {
        plainProject.requiredMaterials = Object.fromEntries(plainProject.requiredMaterials);
      }
      if (plainProject.contributors instanceof Map) {
        plainProject.contributors = Object.fromEntries(plainProject.contributors);
      }

      // Notify other players at the location
      socket.to(`location:${location}`).emit('construction:projectCreated', { project: plainProject });

      callback?.({ project: plainProject });

    } catch (error: any) {
      console.error('Error creating project:', error);

      // ROLLBACK: If gold was deducted but something failed, refund it
      if (goldDeducted && project) {
        try {
          const rollbackPlayer = await Player.findById(player._id);
          if (rollbackPlayer) {
            rollbackPlayer.gold += project.requiredGold;

            // Also remove from active projects if it was added
            if (savedPlayer) {
              rollbackPlayer.activeConstructionProjects = rollbackPlayer.activeConstructionProjects.filter(
                (pid: string) => pid !== project.projectId
              );
            }

            await rollbackPlayer.save();
            console.log(`✅ Refunded ${project.requiredGold}g to player due to project creation failure`);

            // Mark the project as failed and delete it
            if (project._id) {
              await project.deleteOne();
              console.log(`✅ Deleted failed project ${project.projectId}`);
            }
          }
        } catch (rollbackError) {
          console.error('❌ CRITICAL: Failed to rollback gold deduction:', rollbackError);
          console.error('   Project ID:', project.projectId);
          console.error('   Player ID:', player._id);
          console.error('   Gold amount:', project.requiredGold);
          // This needs manual intervention - log details for admin
        }
      }

      callback?.({ error: error.message || 'Failed to create project' });
    }
  });

  /**
   * Join a construction project
   */
  socket.on('construction:joinProject', async (data, callback) => {
    try {
      const { projectId } = data;

      if (!projectId) {
        return callback?.({ error: 'projectId is required' });
      }

      const project = await constructionService.getProjectById(projectId);

      if (!project) {
        return callback?.({ error: 'Project not found' });
      }

      if (project.status !== 'in-progress') {
        return callback?.({ error: 'Project is not active' });
      }

      // Add player to active construction projects
      if (!player.activeConstructionProjects.includes(projectId)) {
        player.activeConstructionProjects.push(projectId);
        await player.save();
      }

      // Join project room for real-time updates
      socket.join(`construction:${projectId}`);

      callback?.({ message: 'Joined project successfully', projectId });
    } catch (error: any) {
      console.error('Error joining project:', error);
      callback?.({ error: error.message || 'Failed to join project' });
    }
  });

  /**
   * Contribute to a construction project
   */
  socket.on('construction:contribute', async (data, callback) => {
    try {
      const { projectId, actionCount = 1 } = data;

      if (!projectId) {
        return callback?.({ error: 'projectId is required' });
      }

      const project = await constructionService.getProjectById(projectId);

      if (!project) {
        return callback?.({ error: 'Project not found' });
      }

      // Contribute to the project
      const result = await constructionService.contributeToProject(project, player, actionCount);

      // Award immediate XP
      await player.addSkillExperience('construction', result.xpAwarded);

      // Broadcast progress update to everyone watching this project
      const progressUpdate = {
        projectId,
        completedActions: result.project.completedActions,
        totalActions: result.project.totalActions,
        contributorName: player.userId.toString(), // Will be updated with username
        actionsCompleted: actionCount
      };

      io.to(`construction:${projectId}`).emit('construction:projectProgress', progressUpdate);

      // If project completed, handle completion
      if (result.completed) {
        const completion = await constructionService.completeProject(result.project);

        // Award final XP to all contributors
        for (const [userId, reward] of completion.rewards.entries()) {
          // TODO: Find player by userId and award XP
          // For now, just broadcast the rewards
        }

        // Add property to owner's properties if it's a house
        if (completion.property && result.project.projectType === 'house') {
          const owner = await Player.findOne({ userId: result.project.ownerId });
          if (owner) {
            owner.properties.push(completion.property.propertyId);
            await owner.save();
          }
        }

        // Remove from active projects for all contributors
        result.project.contributors.forEach(async (contributor) => {
          const contributorPlayer = await Player.findOne({ userId: contributor.userId });
          if (contributorPlayer) {
            contributorPlayer.activeConstructionProjects = contributorPlayer.activeConstructionProjects.filter(
              (pid: string) => pid !== projectId
            );
            await contributorPlayer.save();
          }
        });

        // Broadcast completion
        const completionData = {
          projectId,
          property: completion.property?.toObject(),
          rewards: Array.from(completion.rewards.entries()).map(([userId, reward]) => ({
            userId: reward.userId,
            username: reward.username,
            xpAwarded: reward.xpAwarded
          }))
        };

        io.to(`construction:${projectId}`).emit('construction:projectCompleted', completionData);

        callback?.({ completed: true, ...completionData });
      } else {
        callback?.({
          xpAwarded: result.xpAwarded,
          completedActions: result.project.completedActions,
          totalActions: result.project.totalActions
        });
      }
    } catch (error: any) {
      console.error('Error contributing to project:', error);
      callback?.({ error: error.message || 'Failed to contribute to project' });
    }
  });

  /**
   * Abandon a construction project
   */
  socket.on('construction:abandonProject', async (data, callback) => {
    try {
      const { projectId } = data;

      if (!projectId) {
        return callback?.({ error: 'projectId is required' });
      }

      const project = await constructionService.getProjectById(projectId);

      if (!project) {
        return callback?.({ error: 'Project not found' });
      }

      const result = await constructionService.abandonProject(project, player);

      // TODO: Refund materials to player inventory

      // Refund gold
      if (result.refundedGold > 0) {
        player.gold += result.refundedGold;
      }

      // Remove from active projects
      player.activeConstructionProjects = player.activeConstructionProjects.filter(
        pid => pid !== projectId
      );

      await player.save();

      // Broadcast abandonment to watchers
      io.to(`construction:${projectId}`).emit('construction:projectAbandoned', { projectId });

      callback?.({
        message: 'Project abandoned successfully',
        refundedMaterials: Object.fromEntries(result.refundedMaterials),
        refundedGold: result.refundedGold
      });
    } catch (error: any) {
      console.error('Error abandoning project:', error);
      callback?.({ error: error.message || 'Failed to abandon project' });
    }
  });

  /**
   * Get status of a specific project
   */
  socket.on('construction:getStatus', async (data, callback) => {
    try {
      const { projectId } = data;

      if (!projectId) {
        return callback?.({ error: 'projectId is required' });
      }

      const project = await constructionService.getProjectById(projectId);

      if (!project) {
        return callback?.({ error: 'Project not found' });
      }

      const plainProject = project.toObject();
      if (plainProject.requiredMaterials instanceof Map) {
        plainProject.requiredMaterials = Object.fromEntries(plainProject.requiredMaterials);
      }
      if (plainProject.contributors instanceof Map) {
        plainProject.contributors = Object.fromEntries(plainProject.contributors);
      }

      callback?.({ project: plainProject });
    } catch (error: any) {
      console.error('Error getting project status:', error);
      callback?.({ error: error.message || 'Failed to get project status' });
    }
  });
  }); // End connection handler
}
