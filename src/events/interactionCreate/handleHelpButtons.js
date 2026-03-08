const { buildHelpPages, buildEmbed, buildButtons } = require('../../commands/information/help');

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;
    if (
        !interaction.customId.startsWith('help_prev_') &&
        !interaction.customId.startsWith('help_next_')
    ) return;

    // Custom ID format: help_{direction}_{userId}_{currentPage}
    // User IDs are numeric snowflakes, so splitting by '_' is safe.
    const parts = interaction.customId.split('_');

    // Validate basic format: help_{direction}_{userId}_{currentPage}
    if (parts.length !== 4) {
        return interaction.reply({
            content: 'Invalid help navigation data.',
            ephemeral: true,
        });
    }

    const direction = parts[1];       // 'prev' or 'next'
    const userId = parts[2];          // originating user's ID
    const parsedPage = Number(parts[3]);

    // Validate direction and page number
    if ((direction !== 'prev' && direction !== 'next') || !Number.isInteger(parsedPage)) {
        return interaction.reply({
            content: 'Invalid help navigation data.',
            ephemeral: true,
        });
    }

    const currentPage = parsedPage;
    // Only the user who ran /help may navigate.
    if (interaction.user.id !== userId) {
        return interaction.reply({
            content: 'Only the user who ran this command can navigate the pages.',
            ephemeral: true,
        });
    }

    const pages = buildHelpPages();
    const newPage = Math.max(
        0,
        Math.min(
            direction === 'prev' ? currentPage - 1 : currentPage + 1,
            pages.length - 1,
        ),
    );

    const embed = buildEmbed(pages, newPage);
    const row = buildButtons(newPage, pages.length, userId);

    await interaction.update({ embeds: [embed], components: [row] });
};
