const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const GuildConfiguration = require("../../models/GuildConfiguration")

module.exports = {

    /**
     *
     * @param client
     * @param interaction
     */

    callback: async (client, interaction) => {
        let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId });

        if (!guildConfiguration) {
            guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId });
        };

        const channel = interaction.options.getChannel('channel');

        if (guildConfiguration.suggestionChannelIds.includes(channel.id)) {
            await interaction.reply(`${channel} is already a suggestion channel!`);
            return;
        };

        guildConfiguration.suggestionChannelIds.push(channel.id);
        await guildConfiguration.save();

        await interaction.reply(`Added ${channel} to suggestion channels!`);
        return;
    },

    name: 'add-suggestion-channel',
    description: 'Add a new suggestion channel.',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to add.',
            type: 7,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}