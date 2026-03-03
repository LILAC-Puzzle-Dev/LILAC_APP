const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');
const PuzzleGame = require('../../models/PuzzleGame');
const PuzzleSubmission = require('../../models/PuzzleSubmission');
const UserPuzzleMasteryScore = require('../../models/UserPuzzleMasteryScore');

module.exports = async (client, interaction) => {

    // Handle game selection from the string select menu
    if (interaction.isStringSelectMenu() && interaction.customId.startsWith('puzzle-select-')) {
        const gameCustomId = interaction.values[0];
        try {
            await interaction.deferReply();

            const game = await PuzzleGame.findOne({ custom_id: gameCustomId, status: 'active' });

            if (!game) {
                return interaction.editReply({ content: 'This game is no longer active.' });
            }

            // Check for existing completed submission
            const existingSubmission = await PuzzleSubmission.findOne({
                user_id: interaction.user.id,
                game_custom_id: gameCustomId,
                completion_status: 'complete',
            });

            if (existingSubmission) {
                return interaction.editReply({
                    content: `You have already completed **${game.title}**! You scored **${existingSubmission.score}** point(s).`,
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(`${game.title}`)
                .setDescription(`${game.description}\n\n*By ${game.author}*`)
                .setColor('#7B68EE')
                .setFooter({ text: `Game ID: ${game.custom_id} • ${game.questions.length} question(s)` });

            for (let i = 0; i < game.questions.length; i++) {
                const q = game.questions[i];
                embed.addFields({
                    name: `Q${i + 1}: ${q.title}`,
                    value: q.description,
                });
            }

            const totalModals = Math.ceil(game.questions.length / 5);
            const buttonLabel = totalModals > 1 ? `Submit Answers (${totalModals} parts)` : 'Submit Answers';

            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`puzzle-submit-${gameCustomId}`)
                    .setLabel(buttonLabel)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📝'),
            );

            await interaction.editReply({
                embeds: [embed],
                components: [button],
            });
        } catch (error) {
            console.error('Error in puzzle select handler for game', gameCustomId, 'user', interaction.user.id, ':', error);
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({
                        content: 'An unexpected error occurred while loading this puzzle. Please try again later.',
                        embeds: [],
                        components: [],
                    });
                } else if (typeof interaction.isRepliable === 'function' ? interaction.isRepliable() : interaction.isRepliable) {
                    await interaction.reply({
                        content: 'An unexpected error occurred while loading this puzzle. Please try again later.',
                        ephemeral: true,
                    });
                }
            } catch (replyError) {
                console.error('Failed to send error response for puzzle select handler', replyError);
            }
        }
    }

    // Handle "Submit Answers" button
    if (interaction.isButton() && interaction.customId.startsWith('puzzle-submit-')) {
        const gameCustomId = interaction.customId.replace('puzzle-submit-', '');
        try {
            const game = await PuzzleGame.findOne({ custom_id: gameCustomId, status: 'active' });

            if (!game) {
                return interaction.reply({ content: 'This game is no longer active.', ephemeral: true });
            }

            // One-time entry check
            const existingSubmission = await PuzzleSubmission.findOne({
                user_id: interaction.user.id,
                game_custom_id: gameCustomId,
                completion_status: 'complete',
            });

            if (existingSubmission) {
                return interaction.reply({
                    content: `You have already completed **${game.title}**!`,
                    ephemeral: true,
                });
            }

            const questions = game.questions;
            const totalModals = Math.ceil(questions.length / 5);

            // Collect all answers across modals
            const allAnswers = [];
            let continueButtonInteraction;

            for (let modalIndex = 0; modalIndex < totalModals; modalIndex++) {
                const startIdx = modalIndex * 5;
                const endIdx = Math.min(startIdx + 5, questions.length);
                const chunk = questions.slice(startIdx, endIdx);

                const modalId = `puzzle-answer-${gameCustomId}-${interaction.user.id}-${modalIndex}-${Date.now()}`;
                const modal = new ModalBuilder()
                    .setCustomId(modalId)
                    .setTitle(totalModals > 1 ? `Answers (Part ${modalIndex + 1}/${totalModals})` : `Submit Your Answers`);

                for (let i = 0; i < chunk.length; i++) {
                    const q = chunk[i];
                    const textInput = new TextInputBuilder()
                        .setCustomId(`answer-${startIdx + i}`)
                        .setLabel(`Q${startIdx + i + 1}: ${q.title}`.substring(0, 45))
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setMaxLength(100)
                        .setPlaceholder('Enter your answer');

                    modal.addComponents(new ActionRowBuilder().addComponents(textInput));
                }

                // Show the modal
                if (modalIndex === 0) {
                    await interaction.showModal(modal);
                } else {
                    await continueButtonInteraction.showModal(modal);
                }

                const filter = (i) => i.customId === modalId;
                const source = modalIndex === 0 ? interaction : continueButtonInteraction;
                const modalInteraction = await source.awaitModalSubmit({ filter, time: 600_000 }).catch(() => null);

                if (!modalInteraction) {
                    // User closed modal without submitting - they can try again
                    return;
                }

                // Collect answers from this modal
                for (let i = 0; i < chunk.length; i++) {
                    const answer = modalInteraction.fields.getTextInputValue(`answer-${startIdx + i}`);
                    allAnswers.push(answer);
                }

                // If more modals needed, prompt the user
                if (modalIndex < totalModals - 1) {
                    await modalInteraction.reply({
                        content: `Part ${modalIndex + 1}/${totalModals} received! Click below to continue.`,
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`puzzle-continue-${gameCustomId}-${modalIndex + 1}-${interaction.user.id}`)
                                    .setLabel(`Continue to Part ${modalIndex + 2}`)
                                    .setStyle(ButtonStyle.Primary),
                            ),
                        ],
                        ephemeral: true,
                    });

                    // Wait for the continue button
                    const btnFilter = (i) =>
                        i.customId === `puzzle-continue-${gameCustomId}-${modalIndex + 1}-${interaction.user.id}` &&
                        i.user.id === interaction.user.id;

                    continueButtonInteraction = await modalInteraction.awaitMessageComponent({
                        filter: btnFilter,
                        time: 600_000,
                    }).catch(() => null);

                    if (!continueButtonInteraction) return;
                } else {
                    // Last modal - process all answers
                    await modalInteraction.deferReply();

                    // Check all fields are filled
                    const allFilled = allAnswers.every((a) => a && a.trim().length > 0);
                    if (!allFilled) {
                        return modalInteraction.editReply({
                            content: 'All fields must be filled. Your submission was not recorded. You can try again.',
                        });
                    }

                    // Score the answers (case-insensitive)
                    let totalScore = 0;
                    const results = [];

                    for (let i = 0; i < questions.length; i++) {
                        const userAnswer = allAnswers[i].trim().toLowerCase();
                        const isCorrect = questions[i].correct_answers.some(
                            (a) => userAnswer === a.trim().toLowerCase()
                        );

                        if (isCorrect) {
                            totalScore += questions[i].points;
                        }

                        results.push({
                            question: questions[i].title,
                            correct: isCorrect,
                            points: isCorrect ? questions[i].points : 0,
                        });
                    }

                    // Save submission as complete
                    await PuzzleSubmission.findOneAndUpdate(
                        { user_id: interaction.user.id, game_custom_id: gameCustomId },
                        {
                            completion_status: 'complete',
                            score: totalScore,
                        },
                        { upsert: true, new: true },
                    );

                    // Increment mastery points
                    if (totalScore > 0) {
                        await UserPuzzleMasteryScore.findOneAndUpdate(
                            { discordId: interaction.user.id },
                            {
                                $inc: { score: totalScore },
                                $set: { username: interaction.user.username },
                            },
                            { upsert: true, new: true },
                        );
                    }

                    // Build results embed
                    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
                    const resultsEmbed = new EmbedBuilder()
                        .setTitle(`📊 Results: ${game.title}`)
                        .setColor(totalScore === maxPoints ? '#00FF00' : totalScore > 0 ? '#FFA500' : '#FF0000')
                        .setDescription(`You scored **${totalScore}/${maxPoints}** point(s)!`)
                        .setFooter({ text: `Game: ${game.custom_id}` });

                    for (const r of results) {
                        resultsEmbed.addFields({
                            name: `${r.correct ? '✅' : '❌'} ${r.question}`,
                            value: `${r.correct ? `+${r.points} pts` : '0 pts'}`,
                            inline: true,
                        });
                    }

                    await modalInteraction.editReply({
                        embeds: [resultsEmbed],
                    });
                }
            }
        } catch (error) {
            console.error('Error in puzzle submit handler for game', gameCustomId, 'user', interaction.user.id, ':', error);
            const errorMessage =
                'An unexpected error occurred while processing your puzzle submission. Please try again later.';
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({
                        content: errorMessage,
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: errorMessage,
                        ephemeral: true,
                    });
                }
            } catch (replyError) {
                console.error(
                    'Additionally failed to send error response for puzzle submit handler for game',
                    gameCustomId,
                    'user',
                    interaction.user.id,
                    ':',
                    replyError,
                );
            }
        }
    }
};