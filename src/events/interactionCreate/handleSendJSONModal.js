module.exports = async (client, interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId.startsWith('send_json_modal_')) {

        const channelId = interaction.customId.replace('send_json_modal_', '');
        const targetChannel = client.channels.cache.get(channelId);

        const jsonInput = interaction.fields.getTextInputValue('json_input');

        try {
            const data = JSON.parse(jsonInput);

            if (!data.content && (!data.embeds || data.embeds.length === 0)) {
                return interaction.reply({
                    content: 'The JSON provided does not contain any valid content.',
                    ephemeral: true,
                });
            }

            if (!targetChannel) {
                return interaction.reply({
                    content: 'Could not find the target channel.',
                    ephemeral: true,
                });
            }

            await targetChannel.send({
                content: data.content || null,
                embeds: data.embeds || [],
                components: data.components || [],
            });

            await interaction.reply({
                content: `Message sent to ${targetChannel}!`,
                ephemeral: true,
            });

        } catch (error) {
            if (error instanceof SyntaxError) {
                return interaction.reply({
                    content: '**Invalid JSON format.** Make sure you copied the entire block correctly.',
                    ephemeral: true,
                });
            }

            await interaction.reply({
                content: '**Failed to send.** Ensure the bot has permission to post in that channel.',
                ephemeral: true,
            });
        }
    }
};