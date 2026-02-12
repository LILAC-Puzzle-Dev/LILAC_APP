const UserVoiceTime = require('../../models/UserVoiceTime');
const VCRole = require('../../models/VCRole');

module.exports = async (client, oldState, newState) => {

    const member = newState.member;
    if (member.user.bot) return;

    const guildId = member.guild.id;
    const userId = member.id;

    try {
        let userRecord = await UserVoiceTime.findOne({ guildId, discordId: userId });
        if (!userRecord) {
            userRecord = new UserVoiceTime({ guildId, discordId: userId });
        }

        const now = new Date();

        if (oldState.channelId && userRecord.lastJoinTime) {
            const timeDiff = now - userRecord.lastJoinTime;

            if (timeDiff > 1000 && timeDiff < 86400000) {
                userRecord.totalTime += timeDiff;

                const totalMinutes = Math.floor(userRecord.totalTime / 1000 / 60);
                const guildRoles = await VCRole.find({ guildId });

                if (guildRoles.length > 0) {
                    guildRoles.sort((a, b) => a.minutesRequired - b.minutesRequired);

                    let highestRole = null;
                    for (const roleConfig of guildRoles) {
                        if (totalMinutes >= roleConfig.minutesRequired) {
                            highestRole = roleConfig;
                        }
                    }

                    if (highestRole) {
                        if (!member.roles.cache.has(highestRole.roleId)) {
                            try {
                                await member.roles.add(highestRole.roleId);

                                try {
                                    await member.send(`**Congratulations!** You've spent **${totalMinutes} minutes** in Voice Chat and earned the **${member.guild.roles.cache.get(highestRole.roleId)?.name}** role in ${member.guild.name}!`);
                                } catch (dmErr) {
                                    console.log(`Could not DM user ${member.user.tag}.`);
                                }

                            } catch (err) {
                                console.error(`Failed to give VC role: ${err}`);
                            }
                        }

                        for (const roleConfig of guildRoles) {
                            if (roleConfig.roleId !== highestRole.roleId && member.roles.cache.has(roleConfig.roleId)) {
                                try {
                                    await member.roles.remove(roleConfig.roleId);
                                } catch (err) {
                                    console.error(`Failed to remove old VC role: ${err}`);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (newState.channelId && !newState.deaf) {
            userRecord.lastJoinTime = now;
        } else {
            userRecord.lastJoinTime = null;
        }

        await userRecord.save();

    } catch (error) {
        console.error('Error in voiceStateUpdate:', error);
    }
};