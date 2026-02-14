const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;
    if (!customId.startsWith('media_')) return;

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({ content: 'You do not have permission to approve/reject media.', ephemeral: true });
    }

    const parts = customId.split('_');
    const action = parts[1];
    const targetUserId = parts[2];
    const targetChannelId = parts[3];

    const targetChannel = client.channels.cache.get(targetChannelId);
    let targetUser;

    try {
        targetUser = await client.users.fetch(targetUserId);
    } catch (e) {
        targetUser = null;
    }

    if (action === 'approve') {
        if (!targetChannel) {
            return interaction.reply({ content: 'Target channel no longer exists.', ephemeral: true });
        }

        const attachmentUrl = interaction.message.attachments.first()?.url;

        const embedDescription = interaction.message.embeds[0]?.description || '';

        try {
            await targetChannel.send({
                content: `**Media from** ${targetUser ? targetUser : 'Unknown User'}:`,
                files: [attachmentUrl]
            });

            const approvedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor('#00FF00')
                .setTitle('✅ APPROVED');

            await interaction.update({ embeds: [approvedEmbed], components: [] });

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to post image. Check bot permissions in target channel.', ephemeral: true });
        }
    }

    if (action === 'reject') {
        if (targetUser) {
            try {
                await targetUser.send(`Your media submission in **${interaction.guild.name}** was rejected by an admin.`);
            } catch (err) {
            }
        }

        const rejectedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor('#FF0000')
            .setTitle('⛔ REJECTED');

        await interaction.update({ embeds: [rejectedEmbed], components: [] });
    }
};