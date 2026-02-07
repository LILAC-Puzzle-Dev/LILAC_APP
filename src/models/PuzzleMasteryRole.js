const mongoose = require('mongoose');

const puzzleMasteryRoleSchema = new mongoose.Schema({
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

puzzleMasteryRoleSchema.index({ guildId: 1, roleId: 1 }, { unique: true });

module.exports = mongoose.model('PuzzleMasteryRole', puzzleMasteryRoleSchema);