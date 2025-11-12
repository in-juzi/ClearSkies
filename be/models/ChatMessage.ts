import mongoose, { Document, Schema, Model } from 'mongoose';

// ============================================================================
// Type Definitions
// ============================================================================

export type ChatChannel = 'global';

export interface ChatMessageDocument {
  userId: mongoose.Types.ObjectId;
  username: string;
  message: string;
  channel: ChatChannel;
  createdAt: Date;
}

// ============================================================================
// Document Interface (represents a ChatMessage document from MongoDB)
// ============================================================================

export interface IChatMessage extends ChatMessageDocument, Document {}

// ============================================================================
// Model Interface (includes static methods)
// ============================================================================

export interface IChatMessageModel extends Model<IChatMessage> {
  getRecentMessages(channel?: ChatChannel, limit?: number): Promise<ChatMessageDocument[]>;
}

// ============================================================================
// Schema Definition
// ============================================================================

const chatMessageSchema = new Schema<IChatMessage, IChatMessageModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  channel: {
    type: String,
    default: 'global',
    enum: ['global'], // MVP: only global channel
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false // We're manually handling createdAt
});

// TTL index: automatically delete messages older than 7 days (604800 seconds)
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

// ============================================================================
// Static Methods
// ============================================================================

// Static method to get recent messages
chatMessageSchema.statics.getRecentMessages = async function(
  channel: ChatChannel = 'global',
  limit: number = 50
): Promise<ChatMessageDocument[]> {
  return this.find({ channel })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('userId username message createdAt')
    .lean()
    .then(messages => messages.reverse()); // Return in chronological order
};

// ============================================================================
// Model Export
// ============================================================================

const ChatMessage: IChatMessageModel = mongoose.model<IChatMessage, IChatMessageModel>(
  'ChatMessage',
  chatMessageSchema
);

export default ChatMessage;
