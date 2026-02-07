const mongoose = require('mongoose');

const userPuzzleMasteryScoreSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('UserPuzzleMasteryScore', userPuzzleMasteryScoreSchema);