const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const WOTW = require("../../models/WordOfTheWeek");
const WOTWUser = require("../../models/WordOfTheWeekUser");

const logChannelId = '1473295081913061497';
const publicChannelId = '1428273198348369920';

module.exports = async (client, interaction) => {

    if (interaction.isButton() && interaction.customId === "wotw-button") {
        try {
            const modal = new ModalBuilder()
                .setTitle("Word of the Week")
                .setCustomId(`wotw-${interaction.member.id}`);

            const textInput = new TextInputBuilder()
                .setCustomId("wotw-input")
                .setLabel("Submit your answer below")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(30)
                .setPlaceholder("Enter your guess here.");

            const actionRow = new ActionRowBuilder().addComponents(textInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);

            const filter = (i) => i.customId === `wotw-${interaction.member.id}`;

            const modalInteraction = await interaction.awaitModalSubmit({
                filter,
                time: 1000 * 60 * 3,
            }).catch((error) => console.log('Modal timeout or error:', error));

            if (!modalInteraction) return;

            await modalInteraction.deferReply({ ephemeral: true });

            const wotwText = modalInteraction.fields.getTextInputValue("wotw-input");
            const wotwTextLower = wotwText.toLowerCase().trim();

            const wordOfTheWeek = await WOTW.findOne({ isLive: true });
            let wordOfTheWeekUser = await WOTWUser.findOne({ userId: interaction.member.id });

            if (!wordOfTheWeek) {
                return modalInteraction.editReply("No ongoing game!");
            }

            if (wordOfTheWeekUser) {
                const lastDailyDate = wordOfTheWeekUser.lastGuessDate;
                const currentDate = new Date();
                const timeDiff = currentDate - lastDailyDate;
                const threeHours = 3 * 60 * 60 * 1000;

                if (timeDiff < threeHours) {
                    const remainingTime = threeHours - timeDiff;
                    const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
                    const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

                    return modalInteraction.editReply(
                        `You have already submitted your guess recently. Come back in **${remainingHours}h ${remainingMinutes}m**!`
                    );
                }

                wordOfTheWeekUser.lastGuessDate = new Date();
            } else {
                wordOfTheWeekUser = new WOTWUser({ userId: interaction.member.id, lastGuessDate: new Date() });
            }

            await wordOfTheWeekUser.save();

            const wotwOriginalWord = wordOfTheWeek.word.toLowerCase();
            const isCorrect = wotwOriginalWord === wotwTextLower;

            const logChannel = client.channels.cache.get(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle(isCorrect ? 'WOTW Winner Found!' : 'WOTW Guess Log')
                    .setColor(isCorrect ? '#00FF00' : '#FFA500')
                    .addFields(
                        { name: 'User', value: `${interaction.user} (\`${interaction.user.id}\`)`, inline: true },
                        { name: 'Guess', value: `\`${wotwText}\``, inline: true },
                        { name: 'Result', value: isCorrect ? '✅ **CORRECT**' : '❌ **INCORRECT**', inline: true },
                        { name: 'Game ID', value: `\`${wordOfTheWeek.gameId}\``, inline: false }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }

            if (isCorrect) {
                await modalInteraction.editReply("**Your answer is correct!** Congratulations on winning this Word of the Week event!");

                wordOfTheWeek.isLive = false;
                wordOfTheWeek.winnerId = interaction.member.id;
                await wordOfTheWeek.save();

                const messageChannel = await client.channels.cache.get(publicChannelId);
                if (messageChannel) {
                    const winEmbed = new EmbedBuilder()
                        .setTitle("Word of the Week Ended")
                        .setDescription("Someone has found the right answer! The event review will come out soon...")
                        .setColor('#FFD700')
                        .addFields(
                            { name: "Game ID", value: `${wordOfTheWeek.gameId}`, inline: true },
                            { name: "Winner", value: `${interaction.member}`, inline: true }
                        );

                    await messageChannel.send({ embeds: [winEmbed] });
                }

            } else {
                await modalInteraction.editReply("**Your answer is incorrect!** Try again later.");
            }

        } catch (error) {
            console.error('Error in WOTW Button Handler:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'An error occurred processing your guess.', ephemeral: true }).catch(() => {});
            }
        }
    }
};