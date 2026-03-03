const User = require('../models/User');

class ExampleAchievement {
    constructor() {
        // Metadata
        this.id = 'getting-started';
        this.name = 'Gerting Started';
        this.emoji = '💵';
        this.color = '#57F287';
        this.rarity = 'Common';
        this.category = 'Social';

        // Requirements
        this.description = 'Obtain 1000 LILAC Coins.';
        this.dependsOn = null;

        // Rewards
        this.roleRewards = [];

        // Visibility
        this.isSecret = true;
    }

    /**
     * Check if a member qualifies for this achievement.
     * @param {GuildMember} member - The Discord guild member.
     * @param {Object} userData - The user's stats from the database.
     * @returns {Boolean} Whether the member meets the achievement criteria.
     */
    async check(member, userData) {
        const user = await User.findOne({userId: member.id });

        return (user?.balance ?? 0) >= 1000;
    }
}

module.exports = ExampleAchievement;