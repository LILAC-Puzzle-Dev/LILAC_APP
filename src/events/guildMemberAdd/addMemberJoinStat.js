const { Client, Message } = require('discord.js');
const GuildStats = require('../../models/GuildStats');

module.exports = async (client, message) => {

    const query = {
        guildId: message.guild.id,
    }

    try {

        const guildStats = await GuildStats.findOne(query);

        if (!guildStats) {
            const newGuildStats = new GuildStats({
                guildId: message.guild.id,
                totalMessageCreate: 0,
                totalMemberJoin: 1,
            });

            await newGuildStats.save();
        }else {
            guildStats.totalMemberJoin += 1;
            await guildStats.save().catch((err) => {
                console.log(`Error occurred when saving: ${err}`);
            });
        }

    }catch(err) {
        console.log(err);
    }

}