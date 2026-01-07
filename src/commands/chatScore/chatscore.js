const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const UserChatScore = require('../../models/UserChatScore');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }

        await interaction.deferReply();

        const targetMember = interaction.options.getMember('user') || interaction.member;

        try {
            const userData = await UserChatScore.findOne({ discordId: targetMember.id });

            if (!userData) {
                return interaction.editReply(
                    targetMember.id === interaction.member.id
                        ? "You haven't sent any messages yet! Start chatting to earn points."
                        : `${targetMember.displayName} hasn't earned any points yet.`
                );
            }

            const scoreEmbed = new EmbedBuilder()
                .setTitle(`All-Time Statistics`)
                .setAuthor({
                    name: targetMember.displayName,
                })
                .setColor(0x2F3136)
                .addFields(
                    {
                        name: 'Total Chat Score',
                        value: `**${userData.score.toLocaleString()}** points`,
                        inline: true
                    },
                    {
                        name: 'This Month',
                        value: `**${userData.monthlyScore.toLocaleString()}** points`,
                        inline: true
                    }
                )
                .setFooter({ text: `User ID: ${targetMember.id}` })

            await interaction.editReply({ embeds: [scoreEmbed] });

        } catch (error) {
            console.error('Error fetching user score:', error);
            await interaction.editReply("There was an error retrieving the score.");
        }
    },

    name: 'chatscore',
    description: 'Show your or another member\'s total chat score.',
    options: [
        {
            name: 'user',
            description: 'The user whose score you want to check.',
            type: 6,
            required: false,
        },
    ],
    botPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
};