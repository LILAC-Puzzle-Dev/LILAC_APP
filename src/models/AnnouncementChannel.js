const mongoose = require('mongoose');

const announcementChannelSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('AnnouncementChannel', announcementChannelSchema);