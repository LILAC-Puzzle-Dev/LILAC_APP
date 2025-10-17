module.exports = async (oldMessage, newMessage) => {

    const logChannelId = '1427625028547248228';

    if (newMessage.author?.bot || !newMessage.guild || !oldMessage.content) return;

    if (oldMessage.content === newMessage.content) return;

    const client = newMessage.client;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const messageEmbed = {
        color: 0xFFA500,
        title: 'Message Update Log',
        description: `**User**:
${newMessage.author}

**Channel**:
${newMessage.channel}

**Original Content**:
${oldMessage.content.length > 1024 ? oldMessage.content.substring(0, 1021) + '...' : oldMessage.content || '*Null*'}

**New Content**:
${newMessage.content.length > 1024 ? newMessage.content.substring(0, 1021) + '...' : newMessage.content || '*Null*'}`,
        footer: {
            text: `Message ID: ${newMessage.id}`,
        },
        timestamp: new Date().toISOString(),
    };

    logChannel.send({ embeds: [messageEmbed] }).catch(console.error);

}