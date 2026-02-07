const { PermissionFlagsBits } = require('discord.js');
const FeatureSwitch = require('../../models/FeatureSwitch');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }

        const featureName = interaction.options.getString('feature');
        const status = interaction.options.getBoolean('status');

        try {
            await interaction.deferReply({ ephemeral: true });

            await FeatureSwitch.findOneAndUpdate(
                { guildId: interaction.guild.id, featureName: featureName },
                { isEnabled: status },
                { upsert: true, new: true }
            );

            await interaction.editReply({
                content: `Feature **${featureName}** has been **${status ? 'enabled' : 'disabled'}**.`
            });
        } catch (error) {
            console.log(`Error toggling feature: ${error}`);
            await interaction.editReply('Failed to update the feature status.');
        }
    },

    name: 'toggle-feature',
    description: 'Turn a specific bot feature on or off.',
    options: [
        {
            name: 'feature',
            description: 'The name of the feature.',
            type: 3,
            required: true,
        },
        {
            name: 'status',
            description: 'Enabled (True) or Disabled (False).',
            type: 5,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
};