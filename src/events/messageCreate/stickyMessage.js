const StickyMessage = require('../../models/StickyMessage');

module.exports = async (client, message) => {
    if (message.author?.bot || !message.guild) return;

    try {
        const sticky = await StickyMessage.findOne({ channelId: message.channel.id });
        if (!sticky) return;

        // Delete the previous sticky message if it exists
        if (sticky.lastMessageId) {
            const previous =
                message.channel.messages.cache.get(sticky.lastMessageId) ||
                await message.channel.messages.fetch(sticky.lastMessageId).catch(() => null);
            if (previous) await previous.delete().catch(() => null);
        }

        // Send the new sticky message
        const sent = await message.channel.send(sticky.content);

        // Save the new message ID
        sticky.lastMessageId = sent.id;
        await sticky.save();
    } catch (error) {
        console.error('Error handling sticky message:', error);
    }
};
