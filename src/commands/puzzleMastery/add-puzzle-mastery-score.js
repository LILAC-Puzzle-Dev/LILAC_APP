const { PermissionFlagsBits } = require('discord.js');
const UserPuzzleMasteryScore = require('../../models/UserPuzzleMasteryScore');
const PuzzleMasteryRole = require('../../models/PuzzleMasteryRole');

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: "You need Admin permissions to modify scores.",
                ephemeral: true
            });
        }

        const targetUser = interaction.options.getUser('user');
        const scoreToAdd = interaction.options.get('score').value;

        await interaction.deferReply();

        try {
            const updatedProfile = await UserPuzzleMasteryScore.findOneAndUpdate(
                { discordId: targetUser.id },
                {
                    $inc: { score: scoreToAdd },
                    $set: { username: targetUser.username }
                },
                { upsert: true, new: true }
            );

            const guildConfiguredRoles = await PuzzleMasteryRole.find({ guildId: interaction.guild.id });
            const member = await interaction.guild.members.fetch(targetUser.id);

            let roleAdded = null;
            let rolesRemoved = [];

            if (guildConfiguredRoles.length > 0 && member) {
                guildConfiguredRoles.sort((a, b) => a.threshold - b.threshold);

                let highestEligibleRole = null;
                for (const roleConfig of guildConfiguredRoles) {
                    if (updatedProfile.score >= roleConfig.threshold) {
                        highestEligibleRole = roleConfig;
                    }
                }

                if (highestEligibleRole) {
                    if (!member.roles.cache.has(highestEligibleRole.roleId)) {
                        try {
                            await member.roles.add(highestEligibleRole.roleId);
                            roleAdded = `<@&${highestEligibleRole.roleId}>`;
                        } catch (err) {
                            console.error(`Failed to assign role ${highestEligibleRole.roleId}:`, err);
                        }
                    } else {
                        roleAdded = `<@&${highestEligibleRole.roleId}> (Already had)`;
                    }

                    for (const roleConfig of guildConfiguredRoles) {
                        if (roleConfig.roleId !== highestEligibleRole.roleId) {
                            if (member.roles.cache.has(roleConfig.roleId)) {
                                try {
                                    await member.roles.remove(roleConfig.roleId);
                                    rolesRemoved.push(`<@&${roleConfig.roleId}>`);
                                } catch (err) {
                                    console.error(`Failed to remove role ${roleConfig.roleId}:`, err);
                                }
                            }
                        }
                    }
                }
            }

            let replyText = `**Success!** Added **${scoreToAdd}** points to ${targetUser}.\n`;
            replyText += `Total Score: **${updatedProfile.score}**`;

            if (roleAdded && !roleAdded.includes('(Already had)')) {
                replyText += `\n\n🔼 **Role Upgraded:** ${roleAdded}`;
            }

            if (rolesRemoved.length > 0) {
                replyText += `\n🔽 **Roles Removed:** ${rolesRemoved.join(', ')}`;
            }

            await interaction.editReply(replyText);

        } catch (error) {
            console.error('Error adding puzzle mastery score:', error);
            await interaction.editReply({
                content: "There was an error updating the score."
            });
        }
    },

    name: 'add-puzzle-mastery-score',
    description: 'Add score to a user and update their roles (Tiered).',
    options: [
        {
            name: 'user',
            description: 'The user to give points to.',
            type: 6,
            required: true,
        },
        {
            name: 'score',
            description: 'The amount of score to add.',
            type: 4,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],
};