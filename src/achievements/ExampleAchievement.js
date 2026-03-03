const User = require('../models/User');

class ExampleAchievement {
    constructor() {
        // Metadata
        this.id = 'getting-started';
        this.name = 'Gerting Started';
        this.emoji = '💵';
        this.color = '#57F287'; //#D1D5D8 (Common), #41A85F (Uncommon), #2C82C9 (Rare), #9365B8 (Epic), #FAC51C (Legendary), #FF55FF (Mythic)
        this.rarity = 'Common'; //Option: 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'
        this.category = 'Economy';

        // Requirements
        this.description = 'Obtain 1000 LILAC Coins.';
        this.dependsOn = null; //List of achievement IDs that must be obtained before this one can be earned, or null if no dependencies

        // Rewards
        this.roleRewards = [];

        // Visibility
        this.isSecret = true;
        this.isDisabled = true;
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