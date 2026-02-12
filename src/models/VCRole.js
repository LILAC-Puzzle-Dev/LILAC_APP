const mongoose = require('mongoose');

const VCRoleSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    minutesRequired: {
        type: Number,
        required: true
    }
});

VCRoleSchema.index({ guildId: 1, roleId: 1 }, { unique: true });

module.exports = mongoose.model('VCRole', VCRoleSchema);