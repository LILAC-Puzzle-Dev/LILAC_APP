const { Schema, model } = require('mongoose');

const userAchievementSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    obtainedAchievements: {
        type: [String],
        default: [],
    },
    stats: {
        type: Map,
        of: Number,
        default: {},
    },
});

module.exports = model('UserAchievement', userAchievementSchema);
