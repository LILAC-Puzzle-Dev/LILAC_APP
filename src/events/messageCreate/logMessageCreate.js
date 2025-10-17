module.exports = async (client, message) => {

    const logChannelId = '1427625028547248228';

    if (message.author.bot || !message.guild) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) {
        console.error('Channel not found');
        return;
    }

    const messageEmbed = {
        color: 0x0099FF,
        title: 'Message Create Log',
        description: `**User**:
${message.author}

**Channel**:
${message.channel}

**Content**:
${message.content}`,
        timestamp: new Date().toISOString(),
        footer: {
            text: `User ID: ${message.author.id}`,
        },
    };

    if (message.attachments.size > 0) {
        messageEmbed.setImage(message.attachments.first().url);
    }

    logChannel.send({ embeds: [messageEmbed] }).catch(console.error);

}