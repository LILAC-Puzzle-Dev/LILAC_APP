const { Client, Message } = require('discord.js');

module.exports = async (client, message) => {

    const targetChannelId = '1437028473683185676';

    if (!message.author.bot) return;

    if (message.channelId !== targetChannelId) return;

    if (!message.channel.isTextBased() || message.channel.isThread()) return;

    try {
        let threadName = 'Cryptic Thread';

        const thread = await message.startThread({
            name: threadName,
            autoArchiveDuration: 60 * 24,
            reason: 'Auto-thread created by LILAC APP',
        });

    } catch (error) {
        console.error('Error creating thread:', error);
    }

}