const { PermissionFlagsBits } = require('discord.js');
const ChatScoreRole = require('../../models/ChatScoreRole');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: "You need Admin permissions to set rewards.",
                ephemeral: true
            });
        }

        const targetRoleId = interaction.options.get('role').value;
        const threshold = interaction.options.get('threshold').value;

        try {
            await ChatScoreRole.findOneAndUpdate(
                {
                    guildId: interaction.guild.id,
                    roleId: targetRoleId
                },
                {
                    threshold: threshold
                },
                {
                    upsert: true,
                    new: true
                }
            );

            await interaction.reply(`**Configured!** Users will now receive the <@&${targetRoleId}> role when they reach **${threshold}** chat score.`);

        } catch (error) {
            console.error('Error saving chat score role:', error);
            await interaction.reply({
                content: "There was an error saving this role to the database.",
                ephemeral: true
            });
        }
    },

    name: 'add-chatscore-role',
    description: 'Configure your Chatscore role for this server.',
    options: [
        {
            name: 'role',
            description: 'The target role.',
            type: 8,
            required: true,
        },
        {
            name: 'threshold',
            description: 'The threshold for the role.',
            type: 4,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],
}