const { PermissionFlagsBits } = require('discord.js');
const VCRole = require('../../models/VCRole');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) return interaction.reply('Server only.');

        const targetRoleId = interaction.options.getRole('role').id;
        const minutes = interaction.options.getInteger('minutes');

        try {
            await VCRole.findOneAndUpdate(
                { guildId: interaction.guild.id, roleId: targetRoleId },
                { minutesRequired: minutes },
                { upsert: true, new: true }
            );

            interaction.reply({
                content: `Users will now get <@&${targetRoleId}> after spending **${minutes} minutes** in Voice Chat.`,
            });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Database error.", ephemeral: true });
        }
    },

    name: 'add-vc-role',
    description: 'Set a role reward for voice chat activity.',
    options: [
        {
            name: 'role',
            description: 'The role to reward.',
            type: 8,
            required: true,
        },
        {
            name: 'minutes',
            description: 'Minutes required to unlock this role.',
            type: 4,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
};