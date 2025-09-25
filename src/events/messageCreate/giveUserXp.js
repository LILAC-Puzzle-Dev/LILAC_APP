const { Client, Message } = require('discord.js');
const Level = require('../../models/Level');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const cooldowns = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    const xpToGive = getRandomXp(2, 3)

    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    }

    try {
        const level = await Level.findOne(query);

        if (level) {
            level.xp += xpToGive;

            if (level.xp >= calculateLevelXp(level.level)){
                level.xp = 0;
                level.level += 1;

                message.channel.send(`=============================================\n${message.member} you have leveled up to **level ${level.level}**.\n=============================================`);
                message.channel.send("To check the ranks of you/others, you can use the command /level.")
                message.author.send("You have leveled up! Go to LILAC Puzzlehunt Official for more information!")
            }

            await level.save().catch((err) => {
                console.log(`Error occurred when saving: ${err}`);
                return;
            });

            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 30000);
        }

        //if (!level)

        else {
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
            });

            await newLevel.save();
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 30000);
        }
    } catch (error){
        console.log(error);
    }
}