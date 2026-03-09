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
        default: null,
    },
    embeds: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
    },
    components: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
    },
    lastMessageId: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('StickyMessage', stickyMessageSchema);
