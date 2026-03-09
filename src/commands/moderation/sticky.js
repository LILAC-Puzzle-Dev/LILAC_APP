const { PermissionFlagsBits, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const StickyMessage = require('../../models/StickyMessage');
const { deleteStickyMessage } = require('../../utils/deleteStickyMessage');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const channel = interaction.options.getChannel('channel');
            const content = interaction.options.getString('message');

            if (!channel.isTextBased()) {
                return interaction.reply({ content: 'Please select a text-based channel.', ephemeral: true });
            }

            try {
                // Delete any existing sticky message in this channel
                const existing = await StickyMessage.findOne({ channelId: channel.id });
                if (existing) {
                    await deleteStickyMessage(channel, existing.lastMessageId);
                }

                // Send the sticky message immediately
                const sent = await channel.send(content);

                await StickyMessage.findOneAndUpdate(
                    { channelId: channel.id },
                    { guildId: interaction.guild.id, channelId: channel.id, content, embeds: [], components: [], lastMessageId: sent.id },
                    { upsert: true }
                );

                return interaction.reply({
                    content: `Sticky message set for ${channel}:\n> ${content}`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error('Error setting sticky message:', error);
                return interaction.reply({ content: 'Failed to set sticky message.', ephemeral: true });
            }
        }

        if (subcommand === 'convert') {
            const messageLink = interaction.options.getString('message');

            // Parse Discord message link: https://discord.com/channels/{guildId}/{channelId}/{messageId}
            const match = messageLink.match(
                /https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)\/(\d+)/
            );

            if (!match) {
                return interaction.reply({
                    content: 'Invalid message link. Please provide a valid Discord message link.',
                    ephemeral: true,
                });
            }

            const [, linkGuildId, channelId, messageId] = match;

            if (linkGuildId !== interaction.guild.id) {
                return interaction.reply({
                    content: 'The message must be from this server.',
                    ephemeral: true,
                });
            }

            const channel = await interaction.guild.channels.fetch(channelId).catch(() => null);

            if (!channel || !channel.isTextBased()) {
                return interaction.reply({
                    content: 'Could not find the channel from the message link.',
                    ephemeral: true,
                });
            }

            const targetMessage = await channel.messages.fetch(messageId).catch(() => null);

            if (!targetMessage) {
                return interaction.reply({
                    content: 'Could not find the message. Make sure the link is valid and the bot has access to that channel.',
                    ephemeral: true,
                });
            }

            const content = targetMessage.content || null;
            const embeds = targetMessage.embeds.map(e => e.toJSON());
            const components = targetMessage.components.map(c => c.toJSON());

            if (!content && embeds.length === 0) {
                return interaction.reply({
                    content: 'The message has no text content or embeds to use as a sticky message.',
                    ephemeral: true,
                });
            }

            try {
                // Delete any existing sticky message in this channel
                const existing = await StickyMessage.findOne({ channelId: channel.id });
                if (existing) {
                    await deleteStickyMessage(channel, existing.lastMessageId);
                }

                // Build the payload from the target message
                const payload = {};
                if (content) payload.content = content;
                if (embeds.length > 0) payload.embeds = embeds;
                if (components.length > 0) payload.components = components;

                // Send the sticky message immediately
                const sent = await channel.send(payload);

                await StickyMessage.findOneAndUpdate(
                    { channelId: channel.id },
                    { guildId: interaction.guild.id, channelId: channel.id, content, embeds, components, lastMessageId: sent.id },
                    { upsert: true }
                );

                return interaction.reply({
                    content: `Message has been converted to a sticky message in ${channel}.`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error('Error converting sticky message:', error);
                return interaction.reply({ content: 'Failed to convert the message to a sticky message.', ephemeral: true });
            }
        }

        if (subcommand === 'remove') {
            const channel = interaction.options.getChannel('channel');

            if (!channel.isTextBased()) {
                return interaction.reply({ content: 'Please select a text-based channel.', ephemeral: true });
            }

            try {
                const deleted = await StickyMessage.findOneAndDelete({ channelId: channel.id });

                if (!deleted) {
                    return interaction.reply({
                        content: `There is no sticky message set for ${channel}.`,
                        ephemeral: true,
                    });
                }

                // Clean up the last posted sticky message from the channel
                await deleteStickyMessage(channel, deleted.lastMessageId);

                return interaction.reply({
                    content: `Sticky message removed from ${channel}.`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error('Error removing sticky message:', error);
                return interaction.reply({ content: 'Failed to remove sticky message.', ephemeral: true });
            }
        }
    },

    name: 'sticky',
    description: 'Manage sticky messages for channels.',
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.SendMessages],
    options: [
        {
            name: 'add',
            description: 'Set a sticky message for a channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to sticky the message in.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [
                        ChannelType.GuildText,
                        ChannelType.GuildAnnouncement,
                        ChannelType.PublicThread,
                        ChannelType.PrivateThread,
                        ChannelType.AnnouncementThread,
                    ],
                    required: true,
                },
                {
                    name: 'message',
                    description: 'The message to automatically repost at the bottom of the channel.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'convert',
            description: 'Convert an existing message into a sticky message for its channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'message',
                    description: 'The Discord message link of the message to convert into a sticky.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'remove',
            description: 'Remove the sticky message from a channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to remove the sticky message from.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [
                        ChannelType.GuildText,
                        ChannelType.GuildAnnouncement,
                        ChannelType.PublicThread,
                        ChannelType.PrivateThread,
                        ChannelType.AnnouncementThread,
                    ],
                    required: true,
                },
            ],
        },
    ],
};
