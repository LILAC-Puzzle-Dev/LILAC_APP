const UserVoiceTime = require('../../models/UserVoiceTime');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            return interaction.reply('You can only run this command inside a server.');
        }

        const targetUser = interaction.options.getUser('user') || interaction.user;

        try {
            const userRecord = await UserVoiceTime.findOne({
                guildId: interaction.guild.id,
                discordId: targetUser.id
            });

            if (!userRecord || userRecord.totalTime === 0) {
                return interaction.reply(
                    targetUser.id === interaction.user.id
                        ? "You haven't spent any time in voice channels yet."
                        : `${targetUser.username} hasn't spent any time in voice channels yet.`
                );
            }

            const formatTime = (ms) => {
                const totalMinutes = Math.floor(ms / (1000 * 60));
                const days = Math.floor(totalMinutes / (60 * 24));
                const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
                const minutes = totalMinutes % 60;

                let parts = [];
                if (days > 0) parts.push(`**${days}** day${days === 1 ? '' : 's'}`);
                if (hours > 0) parts.push(`**${hours}** hour${hours === 1 ? '' : 's'}`);
                if (minutes > 0 || parts.length === 0) parts.push(`**${minutes}** minute${minutes === 1 ? '' : 's'}`);

                return parts.join(', ');
            };

            const readableTime = formatTime(userRecord.totalTime);

            await interaction.reply({
                content: `**Voice Activity**\nUser: ${targetUser}\nTotal Time: ${readableTime}`
            });

        } catch (error) {
            console.error('Error fetching VC time:', error);
            await interaction.reply({
                content: "There was an error fetching the voice time data.",
                ephemeral: true
            });
        }
    },

    name: 'vc-time',
    description: "Check your or another member's total time spent in voice channels.",
    options: [
        {
            name: 'user',
            description: 'The user whose voice time you want to check.',
            type: 6,
            required: false,
        }
    ],
};