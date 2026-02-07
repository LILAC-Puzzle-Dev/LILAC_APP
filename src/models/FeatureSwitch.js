const mongoose = require('mongoose');

const featureSwitchSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    featureName: {
        type: String,
        required: true,
    },
    isEnabled: {
        type: Boolean,
        default: true,
    },
});

featureSwitchSchema.index({ guildId: 1, featureName: 1 }, { unique: true });

module.exports = mongoose.model('FeatureSwitch', featureSwitchSchema);