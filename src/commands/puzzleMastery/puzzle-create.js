const {
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ComponentType,
} = require('discord.js');
const PuzzleGame = require('../../models/PuzzleGame');

function isUrlFriendly(str) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
}

module.exports = {
    name: 'puzzle-create',
    description: 'Create a new puzzle game with questions.',
    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        const modal = new ModalBuilder()
            .setCustomId(`puzzle-create-modal-${interaction.user.id}`)
            .setTitle('Create Puzzle Game');

        const titleInput = new TextInputBuilder()
            .setCustomId('puzzle-title')
            .setLabel('Game Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(100);

        const customIdInput = new TextInputBuilder()
            .setCustomId('puzzle-custom-id')
            .setLabel('Custom ID (URL-friendly, e.g. my-puzzle)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(50);

        const descInput = new TextInputBuilder()
            .setCustomId('puzzle-description')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);

        const authorInput = new TextInputBuilder()
            .setCustomId('puzzle-author')
            .setLabel('Author Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(100);

        modal.addComponents(
            new ActionRowBuilder().addComponents(titleInput),
            new ActionRowBuilder().addComponents(customIdInput),
            new ActionRowBuilder().addComponents(descInput),
            new ActionRowBuilder().addComponents(authorInput),
        );

        await interaction.showModal(modal);

        const filter = (i) => i.customId === `puzzle-create-modal-${interaction.user.id}`;
        const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 300_000 }).catch(() => null);

        if (!modalInteraction) return;

        const title = modalInteraction.fields.getTextInputValue('puzzle-title');
        const customId = modalInteraction.fields.getTextInputValue('puzzle-custom-id').toLowerCase().trim();
        const description = modalInteraction.fields.getTextInputValue('puzzle-description');
        const author = modalInteraction.fields.getTextInputValue('puzzle-author');

        if (!isUrlFriendly(customId)) {
            return modalInteraction.reply({
                content: '❌ The custom ID must be URL-friendly (lowercase letters, numbers, and hyphens only, e.g. `my-puzzle-1`). Please run the command again with a valid ID.',
                ephemeral: true,
            });
        }

        const existing = await PuzzleGame.findOne({ custom_id: customId });
        if (existing) {
            return modalInteraction.reply({
                content: `❌ A game with the custom ID \`${customId}\` already exists. Please run the command again with a unique ID.`,
                ephemeral: true,
            });
        }

        const questions = [];

        const questionEmbed = () => {
            const embed = new EmbedBuilder()
                .setTitle(`🧩 Creating: ${title}`)
                .setDescription(`**Custom ID:** \`${customId}\`\n**Author:** ${author}\n**Description:** ${description}`)
                .setColor('#7B68EE')
                .setFooter({ text: `Questions added: ${questions.length}` });

            if (questions.length > 0) {
                const fieldList = questions.map((q, i) =>
                    `**${i + 1}.** ${q.title} (${q.points} pts)`
                ).join('\n');
                embed.addFields({ name: 'Questions', value: fieldList.substring(0, 1024) });
            }
            return embed;
        };

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`puzzle-add-q-${interaction.user.id}`)
                .setLabel('Add Question')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('➕'),
            new ButtonBuilder()
                .setCustomId(`puzzle-save-${interaction.user.id}`)
                .setLabel('Save Game')
                .setStyle(ButtonStyle.Success)
                .setEmoji('💾'),
            new ButtonBuilder()
                .setCustomId(`puzzle-cancel-${interaction.user.id}`)
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖'),
        );

        const reply = await modalInteraction.reply({
            embeds: [questionEmbed()],
            components: [buttons],
            ephemeral: true,
            fetchReply: true,
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 600_000,
        });

        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.user.id !== interaction.user.id) {
                return btnInteraction.reply({ content: 'This is not your session.', ephemeral: true });
            }

            if (btnInteraction.customId === `puzzle-cancel-${interaction.user.id}`) {
                collector.stop('cancelled');
                return btnInteraction.update({
                    content: '❌ Puzzle creation cancelled.',
                    embeds: [],
                    components: [],
                });
            }

            if (btnInteraction.customId === `puzzle-save-${interaction.user.id}`) {
                if (questions.length === 0) {
                    return btnInteraction.reply({
                        content: '⚠️ You must add at least one question before saving.',
                        ephemeral: true,
                    });
                }
                collector.stop('saved');

                try {
                    const game = new PuzzleGame({
                        title,
                        custom_id: customId,
                        description,
                        author,
                        questions,
                    });
                    await game.save();

                    return btnInteraction.update({
                        content: `✅ Puzzle game **${title}** (\`${customId}\`) saved with **${questions.length}** question(s)!`,
                        embeds: [],
                        components: [],
                    });
                } catch (error) {
                    console.error('Error saving puzzle game:', error);
                    return btnInteraction.update({
                        content: '❌ An error occurred while saving the game.',
                        embeds: [],
                        components: [],
                    });
                }
            }

            if (btnInteraction.customId === `puzzle-add-q-${interaction.user.id}`) {
                const qModal = new ModalBuilder()
                    .setCustomId(`puzzle-q-modal-${interaction.user.id}-${Date.now()}`)
                    .setTitle(`Add Question #${questions.length + 1}`);

                const qTitle = new TextInputBuilder()
                    .setCustomId('q-title')
                    .setLabel('Question Title')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(100);

                const qDesc = new TextInputBuilder()
                    .setCustomId('q-description')
                    .setLabel('Question Description')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(500);

                const qAnswer = new TextInputBuilder()
                    .setCustomId('q-answer')
                    .setLabel('Correct Answer')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(100);

                const qPoints = new TextInputBuilder()
                    .setCustomId('q-points')
                    .setLabel('Points (number)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(5)
                    .setValue('1');

                qModal.addComponents(
                    new ActionRowBuilder().addComponents(qTitle),
                    new ActionRowBuilder().addComponents(qDesc),
                    new ActionRowBuilder().addComponents(qAnswer),
                    new ActionRowBuilder().addComponents(qPoints),
                );

                await btnInteraction.showModal(qModal);

                const qFilter = (i) => i.customId === qModal.data.custom_id;
                const qModalInteraction = await btnInteraction.awaitModalSubmit({ filter: qFilter, time: 300_000 }).catch(() => null);

                if (!qModalInteraction) return;

                const qTitleVal = qModalInteraction.fields.getTextInputValue('q-title');
                const qDescVal = qModalInteraction.fields.getTextInputValue('q-description');
                const qAnswerVal = qModalInteraction.fields.getTextInputValue('q-answer');
                const qPointsVal = parseInt(qModalInteraction.fields.getTextInputValue('q-points'), 10);

                if (isNaN(qPointsVal) || qPointsVal < 1) {
                    return qModalInteraction.reply({
                        content: '⚠️ Points must be a valid positive number. Question was not added.',
                        ephemeral: true,
                    });
                }

                questions.push({
                    title: qTitleVal,
                    description: qDescVal,
                    correct_answer: qAnswerVal,
                    points: qPointsVal,
                });

                await qModalInteraction.reply({
                    content: `✅ Question #${questions.length} added!`,
                    ephemeral: true,
                });

                await modalInteraction.editReply({
                    embeds: [questionEmbed()],
                    components: [buttons],
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                modalInteraction.editReply({
                    content: '⏰ Puzzle creation timed out.',
                    embeds: [],
                    components: [],
                }).catch(() => {});
            }
        });
    },
};
