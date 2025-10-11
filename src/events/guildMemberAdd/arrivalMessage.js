const { Client, GuildMember } = require('discord.js');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DS_KEY,
});
/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
    try {
        let guild = member.guild;
        if (!guild) return;

        const channel = await client.channels.cache.get('1395685427649708093');

        const response = await openai.chat.completions.create({
            model: "deepseek-reasoner",
            messages: [
                {role: "user", content: `Please welcome me to LILAC Puzzle Official, and politely ask me to check the server rules. My name is ${member.displayName}. Do not reply with "Of course!", just send the welcome message directly.`},
            ],
        }).catch((error) => console.log(error));

        if (!response) {
            console.log("Failed to send arrival message.");
            return;
        }

        await channel.send(`${member}`);
        await channel.send(response.choices[0].message.content)
    } catch (error) {
        console.log(`Error sending arrival message: ${error}`);
    }
};