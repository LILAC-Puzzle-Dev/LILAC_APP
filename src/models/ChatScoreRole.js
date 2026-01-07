const mongoose = require('mongoose');

const chatScoreRoleSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    threshold: {
        type: Number,
        required: true
    }
});

chatScoreRoleSchema.index({ guildId: 1, roleId: 1 }, { unique: true });

module.exports = mongoose.model('ChatScoreRole', chatScoreRoleSchema);