const AnnouncementChannel = require('../../models/AnnouncementChannel');

module.exports = async (client, message) => {
    if (message.author?.bot || !message.guild) return;

    try {
        const isManaged = await AnnouncementChannel.findOne({ channelId: message.channel.id });
        if (!isManaged) return;

        if (message.channel.type === 5) {
            await message.crosspost();
            console.log(`Auto-published message in ${message.channel.name}`);
        }
    } catch (error) {
        if (error.code !== 40033) {
            console.error('Failed to auto-publish message:', error);
        }
    }
};