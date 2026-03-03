const PuzzleSubmission = require('../models/PuzzleSubmission');

class LanternFestivalII {
    constructor() {
        // Metadata
        this.id = 'lantern-festival-ii';
        this.name = 'Lantern Festival II';
        this.emoji = '🏮';
        this.color = '#2C82C9';
        this.rarity = 'Rare';
        this.category = 'Puzzle';

        // Requirements
        this.description = 'Get 4 points in 2026 Lantern Festival Puzzle II.';
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
    async check(member, userData) {
        const puzzleSubmission = await PuzzleSubmission.findOne({
            user_id: member.id,
            game_custom_id: "2026-lantern-festival-two",
            completion_status: 'complete',
        });

        if (!puzzleSubmission) {return false}

        return puzzleSubmission.score === 4;
    }
}

module.exports = LanternFestivalII;