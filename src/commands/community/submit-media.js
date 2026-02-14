const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ApplicationCommandOptionType
} = require('discord.js');

const ADMIN_QUEUE_CHANNEL_ID = '1472059968155811871';

module.exports = {
    name: 'submit-media',
    description: 'Submit an image or file for admin approval.',
    options: [
        {
            name: 'file',
            description: 'The file you want to send.',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        },
        {
            name: 'caption',
            description: 'Optional text to go with the file.',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    callback: async (client, interaction) => {
        const file = interaction.options.getAttachment('file');
        const caption = interaction.options.getString('caption') || '';
        const targetChannel = interaction.channel;

        const approvalChannel = client.channels.cache.get(ADMIN_QUEUE_CHANNEL_ID);
        if (!approvalChannel) {
            return interaction.reply({ content: 'Admin queue channel not configured.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const reviewEmbed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setTitle('WAITING FOR APPROVAL')
            .setDescription(`**User:** ${interaction.user} (${interaction.user.id})\n**Target Channel:** ${targetChannel}\n**Caption:** ${caption || '*None*'}`)
            .setImage(file.contentType && file.contentType.startsWith('image/') ? file.url : null)
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`media_approve_${interaction.user.id}_${targetChannel.id}`)
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅'),
            new ButtonBuilder()
                .setCustomId(`media_reject_${interaction.user.id}_${targetChannel.id}`)
                .setLabel('Reject')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('⛔')
        );

        try {
            await approvalChannel.send({
                content: `**New Media Submission** from ${interaction.user}`,
                embeds: [reviewEmbed],
                files: [file.url],
                components: [row]
            });

            await interaction.editReply({ content: 'Your file has been submitted for approval!', ephemeral: true });
        } catch (error) {
            console.error('Error submitting media:', error);
            await interaction.editReply({ content: 'Failed to submit file. The file might be too large.', ephemeral: true });
        }
    },
};