const { Schema, model } = require("mongoose");
const { randomUUID } = require('crypto');

const WOTWSchema = new Schema({
    gameId: {
        type: String,
        default: randomUUID,
    },
    hostId: {
        type: String,
        required: true,
    },
    isLive: {
        type: Boolean,
        default: true,
    },
    word: {
        type: String,
        required: true,
    },
    winnerId: {
        type: String,
    }
})

module.exports = model("WOTW", WOTWSchema);