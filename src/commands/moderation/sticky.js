const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const StickyMessage = require('../../models/StickyMessage');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'add') {
            const channel = interaction.options.getChannel('channel');
            const content = interaction.options.getString('message');

            try {
                await StickyMessage.findOneAndUpdate(
                    { channelId: channel.id },
                    { guildId: interaction.guild.id, channelId: channel.id, content, lastMessageId: null },
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
    ],
};
