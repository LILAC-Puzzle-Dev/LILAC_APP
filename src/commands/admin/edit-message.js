const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     *
     * @param client
     * @param interaction
     */

    callback: async (client, interaction) => {
        //Main code
        const targetChannel = interaction.options.getChannel('channel');
        const targetMessageID = interaction.options.get('message-id').value;
        let messageContent = interaction.options.get('new-message').value;

        await interaction.deferReply();

        const targetMessage = await targetChannel.messages.fetch(targetMessageID);

        if (!targetMessage){
            interaction.editReply(
                "Message does not exist!",
            );
            return;
        };

        messageContent = messageContent.replace(/\\n/g, '\n').replace(/<br>/g, '\n');

        await targetMessage.edit(messageContent);

        interaction.editReply("The message has been successfully edited.")
    },

    name: 'edit-message',
    description: 'Edit a message using the bot.',
    options: [
        {
            name: 'channel',
            description: 'The channel that contains the target message',
            type: 7,
            required: true,
        },
        {
            name: 'message-id',
            description: 'The ID of the message that you want to edit',
            required: true,
            type: 3,
        },
        {
            name: 'new-message',
            description: 'The new message',
            required: true,
            type: 3,
        },
    ],

    //devOnly: false,
    //testOnly: false,

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
}