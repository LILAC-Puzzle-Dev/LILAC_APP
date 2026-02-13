const { PermissionFlagsBits, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'send-json',
    description: 'Pop up a modal to paste JSON data and send the message.',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'channel',
            description: 'The channel to send the message to.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        const targetChannel = interaction.options.getChannel('channel');

        const modal = new ModalBuilder()
            .setCustomId(`send_json_modal_${targetChannel.id}`)
            .setTitle('JSON Importer');

        const jsonInput = new TextInputBuilder()
            .setCustomId('json_input')
            .setLabel("Paste your JSON text here")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(jsonInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    },
};