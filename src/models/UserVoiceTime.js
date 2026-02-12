const mongoose = require('mongoose');

const userVoiceTimeSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    discordId: {
        type: String,
        required: true
    },
    totalTime: {
        type: Number,
        default: 0
    },
    lastJoinTime: {
        type: Date,
        default: null
    }
});

userVoiceTimeSchema.index({ guildId: 1, discordId: 1 }, { unique: true });

module.exports = mongoose.model('UserVoiceTime', userVoiceTimeSchema);