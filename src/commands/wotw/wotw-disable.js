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

        const gameId = interaction.options.get('game-id').value;

        const query = {
            gameId: gameId
        }

        const wordOfTheWeek = await WOTW.findOne(query);

        if (!wordOfTheWeek) {
            await interaction.editReply("Game not found.");
            return;
        }

        wordOfTheWeek.isLive = false;

        await wordOfTheWeek.save();

        await interaction.editReply("The game has ended!");
    },

    name: 'wotw-disable',
    description: 'Close a Word Of The Week game.',
    options: [
        {
            name: 'game-id',
            description: 'Target game to disable.',
            type: 3,
            required: true,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}