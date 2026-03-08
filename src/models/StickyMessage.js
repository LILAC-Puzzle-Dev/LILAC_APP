const mongoose = require('mongoose');

const stickyMessageSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    lastMessageId: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('StickyMessage', stickyMessageSchema);
