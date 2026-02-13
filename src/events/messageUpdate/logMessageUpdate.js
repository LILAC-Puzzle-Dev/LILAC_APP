module.exports = async (client, oldMessage, newMessage) => {
    const logChannelId = '1427625028547248228';

    if (newMessage.partial) {
        try {
            await newMessage.fetch();
        } catch (error) {
            return;
        }
    }

    if (newMessage.author?.bot || !newMessage.guild) return;
    if (oldMessage.content && oldMessage.content === newMessage.content) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const oldContent = oldMessage.content
        ? (oldMessage.content.length > 1024 ? oldMessage.content.substring(0, 1021) + '...' : oldMessage.content)
        : '*Original content not found (not in bot cache)*';

    const newContent = newMessage.content
        ? (newMessage.content.length > 1024 ? newMessage.content.substring(0, 1021) + '...' : newMessage.content)
        : '*No text content*';

    const messageEmbed = {
        color: 0xFFA500,
        title: 'Message Update Log',
        description: `**User**:\n${newMessage.author}\n\n**Channel**:\n${newMessage.channel}\n\n**Original Content**:\n${oldContent}\n\n**New Content**:\n${newContent}`,
        footer: {
            text: `Message ID: ${newMessage.id}`,
        },
        timestamp: new Date().toISOString(),
    };

    logChannel.send({ embeds: [messageEmbed] }).catch(console.error);
};