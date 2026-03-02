const {
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ComponentType,
    ApplicationCommandOptionType,
} = require('discord.js');
const PuzzleGame = require('../../models/PuzzleGame');

module.exports = {
    name: 'puzzle-manage',
    description: 'Manage an existing puzzle game (toggle status, edit fields).',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'custom_id',
            description: 'The custom ID of the puzzle game to manage.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const customId = interaction.options.getString('custom_id').toLowerCase().trim();
        const game = await PuzzleGame.findOne({ custom_id: customId });

        if (!game) {
            return interaction.editReply({
                content: `❌ No puzzle game found with custom ID \`${customId}\`.`,
            });
        }

        const buildEmbed = () => {
            const embed = new EmbedBuilder()
                .setTitle(`🧩 Managing: ${game.title}`)
                .setColor(game.status === 'active' ? '#00FF00' : '#FF4444')
                .addFields(
                    { name: 'Custom ID', value: `\`${game.custom_id}\``, inline: true },
                    { name: 'Status', value: game.status.toUpperCase(), inline: true },
                    { name: 'Author', value: game.author, inline: true },
                    { name: 'Description', value: game.description.substring(0, 1024) },
                    { name: 'Questions', value: `${game.questions.length} question(s)` },
                );
            return embed;
        };

        const buildButtons = () => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`pm-toggle-${interaction.user.id}`)
                    .setLabel(game.status === 'active' ? 'Set Inactive' : 'Set Active')
                    .setStyle(game.status === 'active' ? ButtonStyle.Danger : ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`pm-edit-${interaction.user.id}`)
                    .setLabel('Edit Fields')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`pm-done-${interaction.user.id}`)
                    .setLabel('Done')
                    .setStyle(ButtonStyle.Secondary),
            );
        };

        const reply = await interaction.editReply({
            embeds: [buildEmbed()],
            components: [buildButtons()],
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300_000,
        });

        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.user.id !== interaction.user.id) {
                return btnInteraction.reply({ content: 'This is not your session.', ephemeral: true });
            }

            if (btnInteraction.customId === `pm-done-${interaction.user.id}`) {
                collector.stop('done');
                return btnInteraction.update({
                    content: '✅ Management session ended.',
                    embeds: [buildEmbed()],
                    components: [],
                });
            }

            if (btnInteraction.customId === `pm-toggle-${interaction.user.id}`) {
                game.status = game.status === 'active' ? 'inactive' : 'active';
                await game.save();

                return btnInteraction.update({
                    embeds: [buildEmbed()],
                    components: [buildButtons()],
                });
            }

            if (btnInteraction.customId === `pm-edit-${interaction.user.id}`) {
                const editModal = new ModalBuilder()
                    .setCustomId(`pm-edit-modal-${interaction.user.id}-${Date.now()}`)
                    .setTitle('Edit Puzzle Game');

                const titleInput = new TextInputBuilder()
                    .setCustomId('edit-title')
                    .setLabel('Title')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(100)
                    .setValue(game.title);

                const descInput = new TextInputBuilder()
                    .setCustomId('edit-description')
                    .setLabel('Description')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1000)
                    .setValue(game.description);

                const authorInput = new TextInputBuilder()
                    .setCustomId('edit-author')
                    .setLabel('Author')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(100)
                    .setValue(game.author);

                editModal.addComponents(
                    new ActionRowBuilder().addComponents(titleInput),
                    new ActionRowBuilder().addComponents(descInput),
                    new ActionRowBuilder().addComponents(authorInput),
                );

                await btnInteraction.showModal(editModal);

                const editFilter = (i) => i.customId === editModal.data.custom_id;
                const editModalInteraction = await btnInteraction.awaitModalSubmit({ filter: editFilter, time: 300_000 }).catch(() => null);

                if (!editModalInteraction) return;

                game.title = editModalInteraction.fields.getTextInputValue('edit-title');
                game.description = editModalInteraction.fields.getTextInputValue('edit-description');
                game.author = editModalInteraction.fields.getTextInputValue('edit-author');
                await game.save();

                await editModalInteraction.reply({
                    content: '✅ Game fields updated!',
                    ephemeral: true,
                });

                await interaction.editReply({
                    embeds: [buildEmbed()],
                    components: [buildButtons()],
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({
                    content: '⏰ Management session timed out.',
                    embeds: [],
                    components: [],
                }).catch(() => {});
            }
        });
    },
};
