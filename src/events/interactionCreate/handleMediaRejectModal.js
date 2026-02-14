const { EmbedBuilder } = require('discord.js');

module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.startsWith('media_reject_modal_')) {
        const parts = interaction.customId.split('_');
        const targetUserId = parts[3];
        const targetChannelId = parts[4];
        const adminMsgId = parts[5];

        const reason = interaction.fields.getTextInputValue('reject_reason');
        const targetUser = await client.users.fetch(targetUserId).catch(() => null);

        if (targetUser) {
            try {
                await targetUser.send(`Your media submission in **${interaction.guild.name}** was rejected.\n**Reason:** ${reason}`);
            } catch (err) {
                console.log(`Could not DM user ${targetUserId}.`);
            }
        }

        try {
            const adminChannel = interaction.channel;
            const adminMsg = await adminChannel.messages.fetch(adminMsgId);

            const rejectedEmbed = EmbedBuilder.from(adminMsg.embeds[0])
                .setColor('#FF0000')
                .setTitle('⛔ REJECTED')
                .addFields({ name: 'Reason', value: reason });

            await adminMsg.edit({ embeds: [rejectedEmbed], components: [] });

            await interaction.reply({ content: 'User notified and log updated.', ephemeral: true });
        } catch (error) {
            console.error('Error updating admin message:', error);
            await interaction.reply({ content: 'Rejection sent, but I could not update the log message.', ephemeral: true });
        }
    }
};