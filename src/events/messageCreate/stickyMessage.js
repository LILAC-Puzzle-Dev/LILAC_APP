const StickyMessage = require('../../models/StickyMessage');
const { deleteStickyMessage } = require('../../utils/deleteStickyMessage');

module.exports = async (client, message) => {
    if (!message.guild) return;

    try {
        const sticky = await StickyMessage.findOne({ channelId: message.channel.id });
        if (!sticky || message.content === sticky.content) return;

        // Delete the previous sticky message if it exists
        await deleteStickyMessage(message.channel, sticky.lastMessageId);

        // Send the new sticky message
        const sent = await message.channel.send(sticky.content);

        // Save the new message ID
        sticky.lastMessageId = sent.id;
        await sticky.save();
    } catch (error) {
        console.error('Error handling sticky message:', error);
    }
};
