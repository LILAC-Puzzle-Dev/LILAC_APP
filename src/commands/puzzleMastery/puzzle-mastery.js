const UserPuzzleMasteryScore = require('../../models/UserPuzzleMasteryScore');

module.exports = {
    callback: async (client, interaction) => {
        const targetUser = interaction.options.getUser('user') || interaction.user;

        try {
            const userProfile = await UserPuzzleMasteryScore.findOne({ discordId: targetUser.id });

            if (!userProfile) {
                await interaction.reply(
                    targetUser.id === interaction.user.id
                        ? "You haven't earned any Puzzle Mastery score yet."
                        : `${targetUser.username} hasn't earned any Puzzle Mastery score yet.`
                );
                return;
            }

            await interaction.reply({
                content: `🧩 **Puzzle Mastery Score**\nUser: ${targetUser}\nScore: **${userProfile.score}**`,
            });

        } catch (error) {
            console.error('Error fetching puzzle mastery score:', error);
            await interaction.reply({
                content: "There was an error fetching the score.",
                ephemeral: true
            });
        }
    },

    name: 'puzzle-mastery',
    description: 'Check your or another user\'s Puzzle Mastery score.',
    options: [
        {
            name: 'user',
            description: 'The user whose score you want to check.',
            type: 6,
            required: false,
        }
    ],
};