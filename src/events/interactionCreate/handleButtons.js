module.exports = async (client, interaction) => {

    const customIds = [
        '1395667039250550865',
        '1417146504459583529',
        '1419144798564126742',
        '1419145191486656714',
        '1417146582536814643',
        '1417146815563698349',
        '1431518267729514598',
    ];

    if (interaction.isButton() && customIds.includes(interaction.customId)) {
        try {
            await interaction.deferReply({ ephemeral: true });
            const role = interaction.guild.roles.cache.get(interaction.customId);
            if (!role){
                await interaction.editReply({
                    content: 'Role could not be found. Contact moderators for support.',
                })
                return;
            }

            const hasRole = interaction.member.roles.cache.has(role.id);

            if (hasRole){
                await interaction.member.roles.remove(role.id);
                await interaction.editReply(`The Role ${role} has been removed from you.`);
            }else {
                await interaction.member.roles.add(role.id);
                await interaction.editReply(`The Role ${role} has been added to you.`);
            }
        } catch(error) {
            console.error(error);
        }
    }
}