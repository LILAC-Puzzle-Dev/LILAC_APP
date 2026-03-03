const AchievementConfig = require('../../models/AchievementConfig');
const getAchievements = require('../../utils/getAchievements');
const { runSetup } = require('../../commands/community/achievements');

module.exports = async (client) => {
    const configs = await AchievementConfig.find();
    if (!configs.length) return;

    const achievements = getAchievements().filter((a) => !a.isDisabled);
    const achievementIds = new Set(achievements.map((a) => a.id));

    for (const config of configs) {
        const trackedIds = new Set(config.achievementMessages?.keys() || []);
        const hasNew = [...achievementIds].some((id) => !trackedIds.has(id));

        if (!hasNew) continue;

        const channel = client.channels.cache.get(config.leaderboardChannelId);
        if (!channel) continue;

        try {
            await runSetup(client, channel, config.guildId);
            console.log(`[Achievements] Auto-refreshed Hall of Fame for guild ${config.guildId}`);
        } catch (err) {
            console.error(`[Achievements] Failed to auto-refresh for guild ${config.guildId}:`, err);
        }
    }
};
