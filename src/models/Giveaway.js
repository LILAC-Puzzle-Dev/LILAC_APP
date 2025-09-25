const { Schema, model } = require('mongoose');

const giveawaySchema = new Schema({
    giveawayId: {
        type: String,
        required: true,
    },
    reward: {
        type: String,
        required: true,
    },
    participants: {
        type: [String],
        default: [],
    }
})

module.exports = model("Giveaway", giveawaySchema);