const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const UserChatScore = require('../../models/UserChatScore')

module.exports = (client) => {

    async function sendMonthlyLeaderboard() {
        const channelId = '1395664796493414480';
        const channel = await client.channels.cache.get(channelId);

        if (!channel) {
            console.error('Leaderboard channel not found.');
            return;
        }

        try {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            const monthName = date.toLocaleString('default', { month: 'long' });

            const topUsers = await UserChatScore.find({ monthlyScore: { $gt: 0 } })
                .sort({ monthlyScore: -1 })
                .limit(3);

            const leaderboardEmbed = new EmbedBuilder()
                .setColor(0xFFD700)
                .setTitle(`Monthly Chat Champion - ${monthName}`)
                .setDescription(`The month has ended! Here are our top contributors.`);

            if (topUsers.length > 0) {
                const winner = topUsers[0];

                leaderboardEmbed.addFields({
                    name: '🥇 First Place',
                    value: `<@${winner.discordId}> \n**${winner.monthlyScore}** pts`,
                    inline: false
                });

                if (topUsers[1]) {
                    leaderboardEmbed.addFields({
                        name: '🥈 Second Place',
                        value: `<@${topUsers[1].discordId}>: **${topUsers[1].monthlyScore}** pts`,
                        inline: true
                    });
                }
                if (topUsers[2]) {
                    leaderboardEmbed.addFields({
                        name: '🥉 Third Place',
                        value: `<@${topUsers[2].discordId}>: **${topUsers[2].monthlyScore}** pts`,
                        inline: true
                    });
                }

                leaderboardEmbed.setFooter({ text: 'LILAC Puzzle Official' });

                await channel.send({ content: '<@&1419144798564126742>', embeds: [leaderboardEmbed] });

            } else {
                await channel.send("The month ended, but no one scored any points! 👻");
            }

            await UserChatScore.updateMany({}, { monthlyScore: 0 });
            console.log('✅ Monthly scores have been reset.');

        } catch (error) {
            console.error('Error running monthly leaderboard:', error);
        }
    }

    cron.schedule('0 0 1 * *', () => {
        sendMonthlyLeaderboard();
    }, {
        scheduled: true,
        timezone: "America/New_York"
    });
};