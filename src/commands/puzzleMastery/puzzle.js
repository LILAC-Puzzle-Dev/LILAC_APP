const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require('discord.js');
const PuzzleGame = require('../../models/PuzzleGame');

module.exports = {
    name: 'puzzle',
    description: 'Browse and play active puzzle games.',

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const activeGames = await PuzzleGame.find({ status: 'active' });

        if (activeGames.length === 0) {
            return interaction.editReply({
                content: '📭 There are no active puzzle games right now. Check back later!',
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🧩 Active Puzzle Games')
            .setDescription('Select a game below to view its questions and submit your answers!')
            .setColor('#7B68EE');

        for (const game of activeGames.slice(0, 25)) {
            embed.addFields({
                name: `${game.title}`,
                value: `${game.description.substring(0, 200)}\n*By ${game.author} • ${game.questions.length} question(s)*`,
            });
        }

        const options = activeGames.slice(0, 25).map((game) => ({
            label: game.title.substring(0, 100),
            description: `${game.questions.length} questions • By ${game.author}`.substring(0, 100),
            value: game.custom_id,
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`puzzle-select-${interaction.user.id}`)
            .setPlaceholder('Choose a puzzle game...')
            .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.editReply({
            embeds: [embed],
            components: [row],
        });
    },
};
