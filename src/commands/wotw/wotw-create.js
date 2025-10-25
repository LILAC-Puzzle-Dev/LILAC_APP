const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const WOTW = require("../../models/WordOfTheWeek")

module.exports = {

    /**
     *
     * @param client
     * @param interaction
     */

    callback: async (client, interaction) => {

        await interaction.deferReply();

        const targetWord = interaction.options.get('word').value;

        const wordOfTheWeek = new WOTW({ hostId: interaction.member.id, word: targetWord.toLowerCase() });

        await wordOfTheWeek.save();

        const messageEmbed = {
            title: "New WOTW",
            description: "Information about this event:",
            fields: [
                {
                    name: "Word",
                    value: `${wordOfTheWeek.word}`,
                },
                {
                    name: "Host ID",
                    value: `${wordOfTheWeek.hostId}`,
                },
                {
                    name: "Game ID",
                    value: `${wordOfTheWeek.gameId}`,
                }
            ]
        };

        await interaction.editReply({
            content: "New event created! Make sure to take down the game ID.",
            embeds: [messageEmbed],
        })
    },

    name: 'wotw-create',
    description: 'Create a Word Of The Week game.',
    options: [
        {
            name: 'word',
            description: 'Target word to guess.',
            type: 3,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}