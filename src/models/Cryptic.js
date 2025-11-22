const { Schema, model } = require("mongoose");
const { randomUUID } = require('crypto');

const crypticSchema = new Schema({
    gameId: {
        type: String,
        default: randomUUID,
    },
    authorId: {
        type: String,
        required: true,
    },
    clue: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: true,
    },
    answer:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        enum: ['pending', 'active', 'success'],
        default: 'pending',
    }
}, {
    timestamps: true
});

crypticSchema.index({ status: 1, createdAt: 1 });

module.exports = model("Cryptic", crypticSchema);