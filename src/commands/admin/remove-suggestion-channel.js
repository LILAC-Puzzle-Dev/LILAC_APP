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

        if (!guildConfiguration.suggestionChannelIds.includes(channel.id)) {
            await interaction.reply(`${channel} is not a suggestion channel!`);
            return;
        };

        guildConfiguration.suggestionChannelIds = guildConfiguration.suggestionChannelIds.filter(
            (id) => id !== channel.id
        );

        await guildConfiguration.save();

        await interaction.reply(`Removed ${channel} from suggestion channels!`);
        return;
    },

    name: 'remove-suggestion-channel',
    description: 'Remove a suggestion channel.',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to remove.',
            type: 7,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}