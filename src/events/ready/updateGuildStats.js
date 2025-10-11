const { ActivityType } = require('discord.js');
const GuildStats = require('../../models/GuildStats');

module.exports = async (client) => {

    async function updateGuildStats() {

        const guild = client.guilds.cache.get('1134508276080447498');

        if (!guild) {
            console.error('No guild found!');
            return;
        }

        const query = {
            guildId: guild.id,
        }

        const guildStats = await GuildStats.findOne(query);

        if (!guildStats) {return}

        const statsChannel = await client.channels.cache.get('1426397788736061512');
        const statsMessage = await statsChannel.messages.fetch('1426398138763313215');

        const messageEmbed = {
            color: 0x3a5a40,
            title: `LILAC Puzzle Official Server Stats`,
            description: `Check the general stats for this Discord server.`,
            fields: [
                {
                    name: `Server ID`,
                    value: `> ${guildStats.guildId}`
                },
                {
                    name: `**Messages Sent Since Start**`,
                    value: `> ${guildStats.totalMessageCreate}`
                },
                {
                    name: `**Members Joined Since Start**`,
                    value: `> ${guildStats.totalMemberJoin}`
                },
            ],
            footer: {
                text: `LILAC Puzzle Official`
            },
            timestamp: new Date().toISOString(),
        }

        statsMessage.edit({
            embeds: [messageEmbed],
            content: "",
        })

    }

    await updateGuildStats()

    setInterval(updateGuildStats, 60000);
};