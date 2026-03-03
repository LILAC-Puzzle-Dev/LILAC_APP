const { Schema, model } = require('mongoose');

const achievementConfigSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    leaderboardChannelId: {
        type: String,
        required: true,
    },
    achievementMessages: {
        type: Map,
        of: String,
        default: {},
    },
});

module.exports = model('AchievementConfig', achievementConfigSchema);
