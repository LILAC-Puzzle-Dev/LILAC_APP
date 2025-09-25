require('dotenv').config();
const { Client, GatewayIntentBits} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const mongoose = require('mongoose');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
    ],
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to Database.`);

        eventHandler(client);

        await client.login(process.env.TOKEN);
    }catch (error) {
        console.log(error);
    }
})();