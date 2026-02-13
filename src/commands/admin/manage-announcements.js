const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const AnnouncementChannel = require('../../models/AnnouncementChannel');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) return interaction.reply('Server only.');

        const subcommand = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel');

        if (channel.type !== 5) {
            return interaction.reply({
                content: 'Please select a valid Announcement/News channel.',
                ephemeral: true
            });
        }

        try {
            if (subcommand === 'add') {
                await AnnouncementChannel.findOneAndUpdate(
                    { channelId: channel.id },
                    { guildId: interaction.guild.id, channelId: channel.id },
                    { upsert: true }
                );
                return interaction.reply(`Added ${channel} to the auto-publish list.`);
            }

            if (subcommand === 'remove') {
                const deleted = await AnnouncementChannel.findOneAndDelete({ channelId: channel.id });
                if (!deleted) return interaction.reply('That channel was not in the list.');
                return interaction.reply(`Removed ${channel} from the auto-publish list.`);
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Database error.');
        }
    },

    name: 'manage-announcements',
    description: 'Manage which channels automatically publish news.',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'add',
            description: 'Add a channel to auto-publish.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{ name: 'channel', description: 'The news channel.', type: 7, required: true }]
        },
        {
            name: 'remove',
            description: 'Remove a channel from auto-publish.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{ name: 'channel', description: 'The news channel.', type: 7, required: true }]
        }
    ]
};