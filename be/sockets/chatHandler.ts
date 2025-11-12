import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import User from '../models/User';
import Player from '../models/Player';
import ChatMessage from '../models/ChatMessage';

// Rate limiting: store message timestamps per user
const rateLimiter = new Map<string, number[]>(); // userId -> [timestamp, timestamp, ...]
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const RATE_LIMIT_MAX = 5; // 5 messages per window

/**
 * Check if user has exceeded rate limit
 */
function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const timestamps = rateLimiter.get(userId) || [];

  // Keep only timestamps within the window
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }

  // Add current timestamp
  recentTimestamps.push(now);
  rateLimiter.set(userId, recentTimestamps);

  return false;
}

/**
 * JWT Authentication Middleware for Socket.io
 */
async function authMiddleware(socket: Socket, next: (err?: Error) => void): Promise<void> {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      next(new Error('Authentication token required'));
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      next(new Error('User not found'));
      return;
    }

    // Fetch player data for username
    const player = await Player.findOne({ userId: user._id });
    if (!player) {
      next(new Error('Player not found'));
      return;
    }

    // Attach user and player data to socket (multiple places for compatibility)
    (socket as any).user = user;
    (socket as any).player = player;
    (socket as any).userId = user._id.toString();
    (socket as any).username = user.username; // Username comes from User model, not Player

    // Also set in socket.data for Socket.io v4+
    socket.data = socket.data || {};
    socket.data.user = user;
    socket.data.player = player;
    socket.data.userId = user._id.toString();
    socket.data.username = user.username; // Username comes from User model, not Player

    next();
  } catch (error) {
    console.error('Socket auth error:', (error as Error).message);
    next(new Error('Authentication failed'));
  }
}

/**
 * Chat Socket Handler
 */
export default function (io: Server): void {
  // Apply authentication middleware
  io.use(authMiddleware);

  io.on('connection', (socket: Socket) => {
    // Try both socket.data and socket properties for compatibility
    const userId = socket.data?.userId || (socket as any).userId;
    const username = socket.data?.username || (socket as any).username;

    console.log(`✓ User connected to chat: ${username} (${userId})`);

    // Join global chat room
    socket.join('global');

    /**
     * Event: chat:getOnlineCount
     * Client requests count of online users
     */
    socket.on('chat:getOnlineCount', async (callback?: (response: any) => void) => {
      try {
        // Get all sockets in the 'global' room
        const sockets = await io.in('global').fetchSockets();
        const count = sockets.length;

        if (typeof callback === 'function') {
          callback({
            success: true,
            count: count
          });
        }
      } catch (error) {
        console.error('Error getting online count:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to get online count'
          });
        }
      }
    });

    /**
     * Event: chat:getHistory
     * Client requests chat history
     */
    socket.on('chat:getHistory', async (data: { limit?: number }, callback?: (response: any) => void) => {
      try {
        const limit = Math.min(data?.limit || 50, 100); // Max 100 messages
        const messages = await ChatMessage.getRecentMessages('global', limit);

        if (typeof callback === 'function') {
          callback({
            success: true,
            messages: messages.map(msg => ({
              userId: msg.userId,
              username: msg.username,
              message: msg.message,
              createdAt: msg.createdAt
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to load chat history'
          });
        }
      }
    });

    /**
     * Event: chat:sendMessage
     * Client sends a chat message
     */
    socket.on('chat:sendMessage', async (data: { message: string }, callback?: (response: any) => void) => {
      try {
        const { message } = data;

        // Validation
        if (!message || typeof message !== 'string') {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Message is required'
            });
          }
          return;
        }

        const trimmedMessage = message.trim();

        if (trimmedMessage.length === 0) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Message cannot be empty'
            });
          }
          return;
        }

        if (trimmedMessage.length > 500) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Message too long (max 500 characters)'
            });
          }
          return;
        }

        // Get userId and username from socket
        const currentUserId = socket.data?.userId || (socket as any).userId;
        const currentUsername = socket.data?.username || (socket as any).username;

        // Rate limiting check
        if (isRateLimited(currentUserId)) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'You are sending messages too quickly. Please slow down.'
            });
          }
          return;
        }

        // Save message to database
        const chatMessage = new ChatMessage({
          userId: currentUserId,
          username: currentUsername,
          message: trimmedMessage,
          channel: 'global'
        });

        await chatMessage.save();

        // Broadcast message to all users in the global channel
        const messageData = {
          userId: chatMessage.userId,
          username: chatMessage.username,
          message: chatMessage.message,
          createdAt: chatMessage.createdAt
        };

        io.to('global').emit('chat:message', messageData);

        // Send success response to sender
        if (typeof callback === 'function') {
          callback({
            success: true,
            message: 'Message sent'
          });
        }
      } catch (error) {
        console.error('Error sending chat message:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to send message'
          });
        }
      }
    });

    /**
     * Event: disconnect
     * User disconnects from chat
     */
    socket.on('disconnect', (reason: string) => {
      console.log(`✗ User disconnected from chat: ${username} (${reason})`);
      // Cleanup (Socket.io handles room cleanup automatically)
    });
  });
}
