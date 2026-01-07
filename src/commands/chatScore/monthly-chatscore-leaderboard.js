const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const UserChatScore = require('../../models/UserChatScore');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }

        await interaction.deferReply();

        try {
            const topUsers = await UserChatScore.find({ monthlyScore: { $gt: 0 } })
                .sort({ monthlyScore: -1 })
                .limit(10);

            if (topUsers.length === 0) {
                return interaction.editReply("No one has earned any points this month yet! Start chatting to see your name here.");
            }

            const monthName = new Date().toLocaleString('default', { month: 'long' });

            const leaderboardEmbed = new EmbedBuilder()
                .setTitle(`Current ${monthName} Leaderboard`)
                .setColor(0x5865F2)
                .setFooter({ text: 'LILAC Puzzle Official' });

            let description = "";

            for (let i = 0; i < topUsers.length; i++) {
                const user = topUsers[i];
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;

                description += `${medal} <@${user.discordId}> — **${user.monthlyScore.toLocaleString()}** pts\n`;
            }

            leaderboardEmbed.setDescription(description);

            await interaction.editReply({ embeds: [leaderboardEmbed] });

        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            await interaction.editReply("There was an error fetching the leaderboard.");
        }
    },

    name: 'monthly-chatscore-leaderboard',
    description: 'Show the top chatscore for the current month.',
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
};