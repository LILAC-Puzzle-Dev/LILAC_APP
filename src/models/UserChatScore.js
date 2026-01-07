const mongoose = require('mongoose');

const userChatScoreSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true
    },
    username: String,
    score: {
        type: Number,
        default: 0
    },
    monthlyScore: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('UserChatScore', userChatScoreSchema);