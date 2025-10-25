const { ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const WOTW = require("../../models/WordOfTheWeek")

module.exports = async (client) => {

    async function updateWOTWInfo() {

        const guild = client.guilds.cache.get('1134508276080447498');
        const infoChannel = await client.channels.cache.get('1430887702147891401');
        const infoMessage = await infoChannel.messages.fetch('1431481609625927681');
        let messageEmbed;

        if (!guild) {
            console.error('No guild found!');
            return;
        }

        const query = {
            isLive: true,
        }

        const wordOfTheWeek = await WOTW.findOne(query);

        if (!wordOfTheWeek) {
            messageEmbed = {
                title: "Submit your WOTW guess",
                description: "No ongoing event!",
                footer: {
                    text: `LILAC Puzzle Official`
                },
                timestamp: new Date().toISOString(),
            }
        }else {

            messageEmbed = {
                title: "Submit your WOTW guess",
                description: "You can submit your guesses using the button below. You can only submit a guess every **three hours**.",
                fields: [
                    {
                        name: "Game ID",
                        value: wordOfTheWeek.gameId,
                    },
                    {
                        name: "Host",
                        value: `<@${wordOfTheWeek.hostId}>`,
                    }
                ],
                footer: {
                    text: `LILAC Puzzle Official`
                },
                timestamp: new Date().toISOString(),
            }
        }

        const button = new ButtonBuilder()
            .setEmoji("📩")
            .setStyle(ButtonStyle.Success)
            .setLabel("Submit")
            .setCustomId("wotw-button")

        const row = new ActionRowBuilder().addComponents(button);

        infoMessage.edit({
            embeds: [messageEmbed],
            components: [row]
        })

    }

    await updateWOTWInfo()

    setInterval(updateWOTWInfo, 60000);
};