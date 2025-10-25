const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const WOTW = require("../../models/WordOfTheWeek")
const WOTWUser = require("../../models/WordOfTheWeekUser")

module.exports = async (client, interaction) => {

    if (interaction.isButton() && interaction.customId === "wotw-button") {
        try {

            const modal = new ModalBuilder().setTitle("Word of the Week").setCustomId(`wotw-${interaction.member.id}`);
            const textInput = new TextInputBuilder()
                .setCustomId("wotw-input")
                .setLabel("Submit your answer below")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(30)
                .setPlaceholder("Enter your guess here.");

            const actionRow = new ActionRowBuilder().addComponents(textInput);

            modal.addComponents(actionRow);

            interaction.showModal(modal);

            const filter = (i) => i.customId === `wotw-${interaction.member.id}`;

            const modalInteraction = await interaction.awaitModalSubmit({
                filter,
                time: 1000 * 60 * 3,
            }).catch((error) => console.log(error));

            await modalInteraction.deferReply({ephemeral: true});

            const wotwText = modalInteraction.fields.getTextInputValue("wotw-input");
            const wotwTextLower = wotwText.toLowerCase();

            const wordOfTheWeek = await WOTW.findOne({ isLive: true });
            let wordOfTheWeekUser = await WOTWUser.findOne({ userId: interaction.member.id });

            if (!wordOfTheWeek) {
                modalInteraction.editReply("No ongoing game!");
                return;
            }

            if (wordOfTheWeekUser){
                const lastDailyDate = wordOfTheWeekUser.lastGuessDate;
                const currentDate = new Date();

                const timeDiff = currentDate - lastDailyDate;
                const threeHours = 3 * 60 * 60 * 1000;

                if (timeDiff < threeHours) {
                    const remainingTime = threeHours - timeDiff;
                    const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
                    const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

                    await modalInteraction.editReply(
                        `You have already submitted your guess recently. Come back in ${remainingHours}h ${remainingMinutes}m!`
                    );
                    return;
                }

                wordOfTheWeekUser.lastGuessDate = new Date();
            }else {
                wordOfTheWeekUser = new WOTWUser({ userId: interaction.member.id, lastGuessDate: new Date() });
            }

            const wotwOriginalWord = wordOfTheWeek.word;

            if (wotwOriginalWord === wotwTextLower){

                await modalInteraction.editReply("Your answer is correct! Congratulations on winning this Word of the Week event!")

                wordOfTheWeek.isLive = false;

                const messageChannel = await client.channels.cache.get('1428273198348369920');

                const messageEmbed = {
                    title: "Word of the Week Ended",
                    description: "Someone has found the right answer! The event review will come out soon...",
                    fields: [
                        {
                            name: "Game ID",
                            value: `${wordOfTheWeek.gameId}`,
                        },
                        {
                            name: "Winner",
                            value: `${interaction.member}`,
                        }
                    ]
                }

                await messageChannel.send({
                    embeds: [messageEmbed],
                    content: "",
                })
            }else {
                await modalInteraction.editReply("Your answer is incorrect! Try again later.")
            }

            await wordOfTheWeekUser.save();
            await wordOfTheWeek.save();

        }catch(error) {
            console.error(error);
        }
    }
}