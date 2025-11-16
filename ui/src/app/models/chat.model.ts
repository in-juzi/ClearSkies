/**
 * Chat message interface
 */
export interface ChatMessage {
  _id?: string; // MongoDB document ID (optional for tracking in loops)
  userId: string;
  username: string;
  message: string;
  createdAt: Date | string;
}

/**
 * Chat history response from server
 */
export interface ChatHistoryResponse {
  success: boolean;
  messages?: ChatMessage[];
  message?: string;
}

/**
 * Send message response from server
 */
export interface SendMessageResponse {
  success: boolean;
  message: string;
}

/**
 * Chat service connection status
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';
