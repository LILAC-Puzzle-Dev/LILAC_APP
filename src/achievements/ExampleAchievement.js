class ExampleAchievement {
    constructor() {
        // Metadata
        this.id = 'first_message';
        this.name = 'First Message';
        this.emoji = '💬';
        this.color = '#57F287';
        this.rarity = 'Common';
        this.category = 'Social';

        // Requirements
        this.description = 'Send your first message in the server.';
        this.dependsOn = null;

        // Rewards
        this.roleRewards = [];

        // Visibility
        this.isSecret = false;
    }

    /**
     * Check if a member qualifies for this achievement.
     * @param {GuildMember} member - The Discord guild member.
     * @param {Object} userData - The user's stats from the database.
     * @returns {Boolean} Whether the member meets the achievement criteria.
     */
    check(member, userData) {
        return (userData.stats?.messagesSent ?? 0) >= 1;
    }
}

module.exports = ExampleAchievement;