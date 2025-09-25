const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    /**
     *
     * @param client
     * @param interaction
     * @returns {Promise<void>}
     */

    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('member').value;
        const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
        const reason = interaction.options.get('reason')?.value || 'No reason provided.';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(mentionable);
        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }
        if (targetUser.user.bot) {
            await interaction.editReply("I can't timeout a bot.");
            return;
        }

        const msDuration = ms(duration);
        if (isNaN(msDuration)) {
            await interaction.editReply("Please enter a valid duration.");
            return;
        }

        if (msDuration < 5000 || msDuration > 2.419e9){
            await interaction.editReply('Timeout duration cannot be less than 5 seconds or more than 28 days.')
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
        const requestUser = interaction.member;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't timeout that member because they have the same/higher role than you.");
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I can't timeout that member because they have the same/higher role than me.");
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
                return;
            }

            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`);

            const channel = await client.channels.cache.get('1396418442734866532');
            if (!channel) return;
            channel.send(`The member ${targetUser} has been timed out by ${requestUser}.\nReason: ${reason}`)
        } catch (error) {
            console.log(`There was an error when timing out: ${error}`);
        }
    },

    name: 'timeout',
    description: 'Timeout a member.',
    options: [
        {
            name: 'member',
            description: 'The member you want to timeout',
            type: 9,
            required: true,
        },
        {
            name: 'duration',
            description: 'Timeout duration(30m, 1h, 3d, etc.)',
            type: 3,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for timeout',
            required: false,
            type: 3,
        }
    ],

    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
}