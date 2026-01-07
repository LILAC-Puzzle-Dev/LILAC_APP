const { Client, Message } = require('discord.js');
const UserChatScore = require('../../models/UserChatScore');
const ChatScoreRole = require('../../models/ChatScoreRole');

module.exports = async (client, message) => {
    if (message.author.bot) return;

    let pointsToAdd = message.content.length;
    if (pointsToAdd > 50){
        pointsToAdd = 50;
    }

    try {
        const userProfile = await UserChatScore.findOneAndUpdate(
            { discordId: message.author.id },
            {
                $inc: { score: pointsToAdd, monthlyScore: pointsToAdd },
                $set: { username: message.author.username }
            },
            { upsert: true, new: true }
        );

        const rewards = await ChatScoreRole.find({ guildId: message.guild.id });

        if (rewards.length > 0) {
            rewards.sort((a, b) => b.threshold - a.threshold);

            const member = message.member;
            let roleToAssign = null;

            for (const reward of rewards) {
                if (userProfile.score >= reward.threshold) {
                    roleToAssign = reward;
                    break;
                }
            }

            if (roleToAssign) {
                if (!member.roles.cache.has(roleToAssign.roleId)) {
                    await member.roles.add(roleToAssign.roleId);

                    const rolesToRemove = rewards
                        .filter(r => r.roleId !== roleToAssign.roleId)
                        .map(r => r.roleId);

                    await member.roles.remove(rolesToRemove);

                    message.channel.send(
                        `**Level Up!** ${message.author} has reached **${userProfile.score}** points and is now a <@&${roleToAssign.roleId}>!`
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error saving score:', error);
    }
}