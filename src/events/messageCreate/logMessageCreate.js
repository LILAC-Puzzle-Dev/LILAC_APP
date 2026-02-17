module.exports = async (client, message) => {

    const logChannelId = '1427625028547248228';

    if (message.author.bot || !message.guild) return;

    const logChannel = client.channels.cache.get(logChannelId);
    if (!logChannel) {
        console.error('Log channel not found');
        return;
    }

    let displayContent = message.content;

    if (!displayContent && message.messageSnapshots && message.messageSnapshots.size > 0) {
        const snapshot = message.messageSnapshots.first();
        if (snapshot.message && snapshot.message.content) {
            displayContent = `**[Forwarded Message]**\n> ${snapshot.message.content}`;
        } else {
            displayContent = `**[Forwarded Message]**\n*(Image or Embed only)*`;
        }
    }

    if (!displayContent && message.attachments.size > 0) {
        displayContent = `*[Attachment: ${message.attachments.first().name || 'File'}]*`;
    }

    if (!displayContent && message.stickers.size > 0) {
        displayContent = `*[Sticker: ${message.stickers.first().name}]*`;
    }

    if (!displayContent) {
        displayContent = '*[No text content]*';
    }

    const messageEmbed = {
        color: 0x0099FF,
        title: 'Message Create Log',
        description: `**User**:
${message.author}

**Channel**:
${message.channel}

**Content**:
${displayContent}`,
        timestamp: new Date().toISOString(),
        footer: {
            text: `User ID: ${message.author.id}`,
        },
    };

    logChannel.send({ embeds: [messageEmbed] }).catch(err => console.error("Failed to send log:", err));
}