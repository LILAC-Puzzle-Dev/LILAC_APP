const {
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    name: 'manage-buttons',
    description: 'Add or remove buttons on an existing bot message.',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'add',
            description: 'Add a new button to a message.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                { name: 'message_id', description: 'ID of the bot message in this channel.', type: 3, required: true },
                { name: 'row', description: 'Which line to add the button to (1-5).', type: 4, required: true, minValue: 1, maxValue: 5 },
                { name: 'label', description: 'The text on the button.', type: 3, required: true },
                { name: 'id_or_url', description: 'The Custom ID or URL for the button.', type: 3, required: true },
                {
                    name: 'style',
                    description: 'The color/style of the button.',
                    type: 4,
                    required: true,
                    choices: [
                        { name: 'Primary (Blue)', value: ButtonStyle.Primary },
                        { name: 'Secondary (Gray)', value: ButtonStyle.Secondary },
                        { name: 'Success (Green)', value: ButtonStyle.Success },
                        { name: 'Danger (Red)', value: ButtonStyle.Danger },
                        { name: 'Link (Gray, opens URL)', value: ButtonStyle.Link },
                    ]
                },
                { name: 'emoji', description: 'Optional emoji for the button.', type: 3, required: false }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a specific button from a message.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                { name: 'message_id', description: 'ID of the bot message in this channel.', type: 3, required: true },
                { name: 'id_or_url', description: 'The Custom ID or URL of the button to remove.', type: 3, required: true }
            ]
        }
    ],

    callback: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const messageId = interaction.options.getString('message_id');

        let targetMessage;
        try {
            targetMessage = await interaction.channel.messages.fetch(messageId);
        } catch (error) {
            return interaction.reply({ content: 'Could not find that message in this channel.', ephemeral: true });
        }

        if (targetMessage.author.id !== client.user.id) {
            return interaction.reply({ content: 'I can only edit my own messages.', ephemeral: true });
        }

        let rows = targetMessage.components.map(row => ActionRowBuilder.from(row));

        if (subcommand === 'add') {
            const rowNumber = interaction.options.getInteger('row') - 1;
            const label = interaction.options.getString('label');
            const style = interaction.options.getInteger('style');
            const idOrUrl = interaction.options.getString('id_or_url');
            const emoji = interaction.options.getString('emoji');

            while (rows.length <= rowNumber) {
                if (rows.length >= 5) break;
                rows.push(new ActionRowBuilder());
            }

            if (rows[rowNumber].components.length >= 5) {
                return interaction.reply({ content: '❌ That row is full! (Max 5 buttons per row).', ephemeral: true });
            }

            const newButton = new ButtonBuilder()
                .setLabel(label)
                .setStyle(style);

            if (style === ButtonStyle.Link) {
                if (!idOrUrl.startsWith('http')) {
                    return interaction.reply({ content: 'For Link buttons, you must provide a valid URL (starting with http).', ephemeral: true });
                }
                newButton.setURL(idOrUrl);
            } else {
                newButton.setCustomId(idOrUrl);
            }

            if (emoji) newButton.setEmoji(emoji);

            rows[rowNumber].addComponents(newButton);

        } else if (subcommand === 'remove') {
            const targetId = interaction.options.getString('id_or_url');

            rows = rows.map(row => {
                const updatedRow = new ActionRowBuilder();

                row.components.forEach(component => {
                    const isTarget = component.data.custom_id === targetId || component.data.url === targetId;

                    if (!isTarget) {
                        updatedRow.addComponents(ButtonBuilder.from(component));
                    }
                });

                return updatedRow;
            }).filter(row => row.components.length > 0); // Remove the row entirely if it becomes empty
        }

        try {
            await targetMessage.edit({ components: rows });
            await interaction.reply({ content: 'Buttons updated successfully!', ephemeral: true });
        } catch (error) {
            await interaction.reply({ content: 'Failed to update buttons. Ensure your IDs and URLs are valid.', ephemeral: true });
        }
    },
};