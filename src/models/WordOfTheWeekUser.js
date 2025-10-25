const { Schema, model } = require("mongoose");

const WOTWUserSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    lastGuessDate: {
        type: Date,
        required: true,
    }
})

module.exports = model("WOTWUser", WOTWUserSchema);