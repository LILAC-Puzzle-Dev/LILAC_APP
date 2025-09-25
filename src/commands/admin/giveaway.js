const { Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     *
     * @param client
     * @param interaction
     */
    callback: async (client, interaction) => {
        const giveawayTime = interaction.options.get("time").value;
        const reward = interaction.options.get("reward").value;

        await interaction.deferReply();

        //Coming soon

        interaction.editReply("This feature is still under development.")

    },

    options: [
        {
            name: 'time',
            type: 4,
            required: true,
            description: "The time for people to join."
        },
        {
            name: 'reward',
            description: "The reward description for the giveaway.",
            type: 3,
            required: true,
        }
    ],
    name: 'giveaway',
    description: 'Set up a giveaway event in the #giveaway channel.',
    permissionsRequired: [PermissionFlagsBits.Administrator],
};