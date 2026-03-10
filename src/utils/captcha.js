const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

/**
 * Generates a random integer math expression and its answer.
 * Supported operators: +, -, *, /
 * Division always produces a whole-number result.
 * @returns {{ expression: string, answer: number }}
 */
function generateExpression() {
    const ops = ['+', '-', '*', '/'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;

    switch (op) {
        case '+':
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * (a - 1)) + 1;
            answer = a - b;
            break;
        case '*':
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
            answer = a * b;
            break;
        case '/':
            b = Math.floor(Math.random() * 10) + 1;
            answer = Math.floor(Math.random() * 10) + 1;
            a = b * answer;
            break;
    }

    return { expression: `${a} ${op} ${b}`, answer };
}

class Captcha {
    /**
     * Runs a CAPTCHA challenge for a specific member in a channel.
     *
     * Sends an embed with a random math expression and a button.
     * Only the target member may interact. If they provide the correct
     * answer within one minute the method resolves `true`; otherwise
     * (wrong answer or timeout) it resolves `false`.
     * The CAPTCHA message is always deleted when the challenge ends.
     *
     * @param {import('discord.js').TextChannel} channel
     * @param {import('discord.js').GuildMember} member
     * @returns {Promise<boolean>}
     */
    static async run(channel, member) {
        const { expression, answer } = generateExpression();
        const uniqueId = `${member.id}-${Date.now()}`;
        const buttonId = `captcha-btn-${uniqueId}`;
        const modalId = `captcha-modal-${uniqueId}`;
        const inputId = `captcha-input-${uniqueId}`;
        const TIME_LIMIT = 60_000;
        const MIN_MODAL_TIME = 5_000;

        const embed = new EmbedBuilder()
            .setTitle('🔐 CAPTCHA Verification')
            .setDescription(
                `<@${member.id}>, please solve the expression below to verify you are human.\n\n` +
                `**\`${expression} = ?\`**\n\n` +
                `Click the button and enter your answer. You have **60 seconds**.`
            )
            .setColor('#5865F2')
            .setFooter({ text: 'Only you can complete this CAPTCHA.' });

        const button = new ButtonBuilder()
            .setCustomId(buttonId)
            .setLabel('Submit Answer')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔑');

        const row = new ActionRowBuilder().addComponents(button);

        const message = await channel.send({ embeds: [embed], components: [row] });

        const startTime = Date.now();

        // Collect button clicks and handle non-target users explicitly
        let btnInteraction = null;

        const collector = message.createMessageComponentCollector({
            time: TIME_LIMIT,
            filter: (i) => i.customId === buttonId,
        });

        await new Promise((resolve) => {
            collector.on('collect', async (i) => {
                // Only the target member can complete this CAPTCHA
                if (i.user.id !== member.id) {
                    if (i.isRepliable() && !i.replied && !i.deferred) {
                        await i
                            .reply({
                                content: 'Only the specified member can use this button.',
                                ephemeral: true,
                            })
                            .catch(() => null);
                    }
                    return;
                }

                btnInteraction = i;
                collector.stop('answered');
                resolve();
            });

            collector.on('end', (_collected, reason) => {
                if (reason !== 'answered') {
                    resolve();
                }
            });
        });
        if (!btnInteraction) {
            await message.delete().catch(() => null);
            return false;
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(TIME_LIMIT - elapsed, MIN_MODAL_TIME);

        // Show a modal with a text input for the answer
        const modal = new ModalBuilder()
            .setCustomId(modalId)
            .setTitle('CAPTCHA — Enter Your Answer');

        const textInput = new TextInputBuilder()
            .setCustomId(inputId)
            .setLabel(`What is ${expression}?`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(20)
            .setPlaceholder('Enter the numeric answer');

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));

        try {
            await btnInteraction.showModal(modal);

            // Await the modal submission
            const modalFilter = (i) => i.customId === modalId && i.user.id === member.id;
            const modalInteraction = await btnInteraction
                .awaitModalSubmit({ filter: modalFilter, time: remaining })
                .catch(() => null);

            if (!modalInteraction) {
                return false;
            }

            const userInput = modalInteraction.fields.getTextInputValue(inputId).trim();
            const userAnswer = parseInt(userInput, 10);
            const success = !isNaN(userAnswer) && userAnswer === answer;

            // Acknowledge the modal with an ephemeral reply
            await modalInteraction
                .deferReply({ ephemeral: true })
                .catch(() => null);

            try {
                const replyContent = success
                    ? 'Answer received. You passed the CAPTCHA.'
                    : 'Incorrect answer. CAPTCHA failed.';
                await modalInteraction.editReply({ content: replyContent });
            } catch (_) {
                // If the interaction was already acknowledged or failed, ignore the error
            }

            return success;
        } finally {
            await message.delete().catch(() => null);
        }
    }
}

module.exports = Captcha;
