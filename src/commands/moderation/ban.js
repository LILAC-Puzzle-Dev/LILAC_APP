const { Client, Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     *
     * @param client
     * @param interaction
     */

    callback: async (client, interaction) => {
        const targetUserID = interaction.options.get('member').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided.";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserID);
        if (!targetUser) {
            await interaction.editReply("That member does not exist!");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't ban the owner!");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePosition = interaction.guild.members.me.roles.highest.position;
        const requestUser = interaction.member;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply(
                "You can't ban that user because they have the same/higher role than you."
            );
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply(
                "I can't ban that user because they have the same/higher role than me."
            );
            return;
        }

        //Executing ban.
        try {
            await targetUser.ban({ reason });
            await interaction.editReply(`The member ${targetUser} has been banned.\nReason: ${reason}`);

            const channel = await client.channels.cache.get('1396400461115822130');
            if (!channel) return;
            channel.send(`The member ${targetUser} has been banned by ${requestUser}.\nReason: ${reason}`)
        } catch (error){
            console.log(error);
        }
    },

    name: 'ban',
    description: 'Ban a member from the server.',
    options: [
        {
            name: 'member',
            description: 'Target member from the server',
            required: true,
            type: 9,
        },
        {
            name: 'reason',
            description: 'The reason for banning',
            required: false,
            type: 3,
        }
    ],

    //devOnly: false,
    //testOnly: false,

    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
}