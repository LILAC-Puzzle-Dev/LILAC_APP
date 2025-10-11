const User = require('../../models/User');

function getRandomCoin(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {

    if (message.author.bot) return;

    const randomChance = Math.floor(Math.random() * 1000) + 1;
    const messageChannel = await client.channels.cache.get('1426428511513612338');
    const coinToGive = getRandomCoin(10000, 100000);

    if (randomChance === 1){

        try {

            const query = {
                userId: message.author.id,
                guildId: message.guild.id,
            };

            let user = await User.findOne(query);

            if (!user) {
                user = new User({
                    ...query,
                    lastDaily: new Date(),
                });
            }

            user.balance += coinToGive;
            await user.save();

            const messageEmbed = {
                color: 0x3a5a40,
                title: `LOOTBOX SPAWNED`,
                description: `${message.author} just found a lootbox and got $${coinToGive} LILAC Coins!`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
                timestamp: new Date().toISOString(),
            };

            messageChannel.send({
                embeds: [messageEmbed],
                content: "",
            });

        }catch(err){
            console.log(err);
        }

    }

}