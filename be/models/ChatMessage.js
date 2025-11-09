const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

// Static method to get recent messages
chatMessageSchema.statics.getRecentMessages = async function(channel = 'global', limit = 50) {
  return this.find({ channel })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('userId username message createdAt')
    .lean()
    .then(messages => messages.reverse()); // Return in chronological order
};

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
