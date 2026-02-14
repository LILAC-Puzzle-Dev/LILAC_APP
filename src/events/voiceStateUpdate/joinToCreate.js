const { ChannelType, PermissionFlagsBits } = require('discord.js');

const hubChannelId = '1395753505234358504';
const targetCategoryId = '1472054575312933015';

module.exports = async (client, oldState, newState) => {
    if (newState.channelId === hubChannelId) {
        try {
            const member = newState.member;
            const guild = newState.guild;

            const newChannel = await guild.channels.create({
                name: `${member.user.username}'s Hangout`,
                type: ChannelType.GuildVoice,
                parent: targetCategoryId,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers],
                    },
                    {
                        id: guild.id,
                        allow: [PermissionFlagsBits.Connect],
                    }
                ]
            });

            await member.voice.setChannel(newChannel);
            await newChannel.send(`Welcome ${member}! This channel will vanish when empty.`);

        } catch (error) {
            console.error('Error creating temp voice channel:', error);
        }
    }

    const oldChannel = oldState.channel;

    if (oldChannel &&
        oldChannel.parentId === targetCategoryId &&
        oldChannel.id !== hubChannelId) {

        if (oldChannel.members.size === 0) {
            try {
                setTimeout(async () => {
                    const channelFetch = await oldState.guild.channels.fetch(oldChannel.id).catch(() => null);
                    if (channelFetch && channelFetch.members.size === 0) {
                        await oldChannel.delete();
                    }
                }, 1000);
            } catch (error) {
                console.error('Error deleting temp voice channel:', error);
            }
        }
    }
};