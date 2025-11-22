const cron = require('node-cron');
const Cryptic = require("../../models/Cryptic")

module.exports = (client) => {

    async function sendCryptic() {

        const channelId = '1437028473683185676';
        const channel = await client.channels.cache.get(channelId);

        async function getIncomingCryptic() {
            try {
                const cryptic = await Cryptic.findOne({ status: 'pending' })
                    .sort({ createdAt: 1 })
                    .exec();

                if (cryptic) {
                    return cryptic;
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error finding cryptic:', error);
            }
        }

        async function getLatestCryptic() {
            try {
                const cryptic = await Cryptic.findOne({ status: 'success' })
                    .sort({ order: -1 })
                    .exec();

                if (cryptic) {
                    return cryptic;
                } else {
                    return null;
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function getActiveCryptic() {
            try {
                const cryptic = await Cryptic.findOne({ status: 'active' })
                    .sort({ order: -1 })
                    .exec();

                if (cryptic) {
                    return cryptic;
                } else {
                    return null;
                }
            } catch (error) {
                console.error(error);
            }
        }

        const incomingCryptic = await getIncomingCryptic();
        const latestCryptic = await getLatestCryptic();
        const activeCryptic = await getActiveCryptic();

        let messageEmbedFirst;
        let messageEmbedSecond;

        if (incomingCryptic === null) {
            messageEmbedFirst = {
                title: `Cryptic Not Available`,
                description: `Currently there is no cryptic game. Maybe there will be something tomorrow.`
            }
        }else {
            messageEmbedFirst = {
                title: `New Daily Cryptic`,
                description: `Share your thoughts in the thread below!`,
                fields: [
                    {
                        name: `Author`,
                        value: `<@${incomingCryptic.authorId}>`
                    },
                    {
                        name: `Clue`,
                        value: `${incomingCryptic.clue}`
                    },
                ]
            }

            incomingCryptic.status = 'active';
            await incomingCryptic.save();
        }

        if (activeCryptic === null) {

            messageEmbedSecond = {
                title: `Cryptic Not Available`,
                description: `No previous cryptic game found.`
            }

        }else {

            messageEmbedSecond = {
                title: `Previous Cryptic`,
                description: `Did you get the right answer?`,
                fields: [
                    {
                        name: `Author`,
                        value: `<@${activeCryptic.authorId}>`
                    },
                    {
                        name: `Clue`,
                        value: `${activeCryptic.clue}`
                    },
                    {
                        name: `Explanation`,
                        value: `${activeCryptic.explanation}`
                    },
                    {
                        name: `Answer`,
                        value: `${activeCryptic.answer}`
                    }
                ]
            }

            activeCryptic.status = 'success';
            await activeCryptic.save();
        }

        await channel.send({
            content: "",
            embeds: [messageEmbedFirst, messageEmbedSecond],
        })

    }

    cron.schedule('0 8 * * *', () => {
        sendCryptic();
    }, {
        scheduled: true,
        timezone: "America/New_York" // CHANGE THIS to your timezone
    });

};