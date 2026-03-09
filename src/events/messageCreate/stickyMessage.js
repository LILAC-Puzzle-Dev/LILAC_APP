const StickyMessage = require('../../models/StickyMessage');
const { deleteStickyMessage } = require('../../utils/deleteStickyMessage');

module.exports = async (client, message) => {
    if (!message.guild) return;
    if (message.author.id === client.user.id) return;

    try {
        const sticky = await StickyMessage.findOne({ channelId: message.channel.id });
        if (!sticky) return;

        // Delete the previous sticky message if it exists
        await deleteStickyMessage(message.channel, sticky.lastMessageId);

        // Build message payload
        const payload = {};
        if (sticky.content) payload.content = sticky.content;
        if (sticky.embeds?.length > 0) payload.embeds = sticky.embeds;
        if (sticky.components?.length > 0) payload.components = sticky.components;

        // Send the new sticky message
        const sent = await message.channel.send(payload);

        // Save the new message ID
        sticky.lastMessageId = sent.id;
        await sticky.save();
    } catch (error) {
        console.error('Error handling sticky message:', error);
    }
};
