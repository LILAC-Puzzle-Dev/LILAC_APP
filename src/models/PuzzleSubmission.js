const { Schema, model } = require("mongoose");

const puzzleSubmissionSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    game_custom_id: {
        type: String,
        required: true,
    },
    completion_status: {
        type: String,
        enum: ['complete', 'incomplete'],
        default: 'incomplete',
    },
    score: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

puzzleSubmissionSchema.index({ user_id: 1, game_custom_id: 1 }, { unique: true });

module.exports = model("PuzzleSubmission", puzzleSubmissionSchema);
