const { Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     *
     * @param client
     * @param interaction
     */

    callback: async (client, interaction) => {
        //Main code
        const targetChannelID = interaction.options.get('channel').value;
        const messageContent = interaction.options.get('message').value;

        await interaction.deferReply();

        const targetChannel = await client.channels.cache.get(targetChannelID);
        if (!targetChannel){
            interaction.editReply(
                "Target channel does not exist!",
            );
            return;
        };

        targetChannel.send(messageContent);

        interaction.editReply("The message has been successfully sent.")
    },

    name: 'send-message',
    description: 'Send a message in a channel using the bot.',
    options: [
        {
            name: 'channel',
            description: 'The channel where you want to send the message',
            required: true,
            type: 7,
        },
        {
            name: 'message',
            description: 'The main part of the message',
            required: true,
            type: 3,
        }
    ],

    //devOnly: false,
    //testOnly: false,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}