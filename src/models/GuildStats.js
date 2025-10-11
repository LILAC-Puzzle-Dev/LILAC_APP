const { Schema, model } = require('mongoose');

const guildStatsSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    totalMessageCreate: {
        type: Number,
        default: 0,
    },
    totalMemberJoin: {
        type: Number,
        default: 0,
    },
})

module.exports = model("GuildStats", guildStatsSchema);