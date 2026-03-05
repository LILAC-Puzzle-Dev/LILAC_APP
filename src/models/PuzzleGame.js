const { Schema, model } = require("mongoose");

const questionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    correct_answers: {
        type: [String],
        required: true,
    },
    points: {
        type: Number,
        required: true,
        default: 1,
    },
});

const puzzleGameSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    custom_id: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    expiration_time: {
        type: String,
        default: null,
    },
    expires_at: {
        type: Date,
        default: null,
    },
    questions: [questionSchema],
}, {
    timestamps: true,
});

module.exports = model("PuzzleGame", puzzleGameSchema);
