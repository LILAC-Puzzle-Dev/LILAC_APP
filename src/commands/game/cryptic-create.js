const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const Cryptic = require("../../models/Cryptic")

module.exports = {

    /**
     *
     * @param client
     * @param interaction
     */

    callback: async (client, interaction) => {

        await interaction.deferReply({ephemeral: true});

        const member = interaction.member;

        if (!member.roles.cache.has('1437031937482166353')){
            await interaction.editReply({
                content: "You don't have permission to use this command.",
            })
            return;
        }

        const authorId = interaction.options.get('author').value;
        const clue = interaction.options.get('clue').value;
        const explanation = interaction.options.get('explanation').value;
        const answer = interaction.options.get('answer').value;

        const author = await interaction.guild.members.fetch(authorId);

        const logChannel = await client.channels.cache.get('1395986231527084093');

        const cryptic = new Cryptic({ authorId: authorId, clue: clue, explanation: explanation, answer: answer });

        await cryptic.save();

        const messageEmbed = {
            title: "New Cryptic",
            description: "Information about this event:",
            fields: [
                {
                    name: "Game ID",
                    value: `${cryptic.gameId}`,
                },
                {
                    name: "Author",
                    value: `${author}`,
                },
                {
                    name: "Clue",
                    value: `${clue}`,
                },
                {
                    name: "Explanation",
                    value: `${explanation}`,
                },
                {
                    name: "Answer",
                    value: `${answer}`,
                }
            ]
        };

        await interaction.editReply({
            content: "",
            embeds: [messageEmbed],
        })

        await logChannel.send({
            content: "New cryptic created!",
            embeds: [messageEmbed],
        })
    },

    name: 'cryptic-create',
    description: 'Create a cryptic entry.',
    options: [
        {
            name: 'author',
            description: 'The author of the puzzle.',
            type: 9,
            required: true,
        },
        {
            name: 'clue',
            description: 'The clue of the puzzle.',
            type: 3,
            required: true,
        },
        {
            name: 'explanation',
            description: 'The explanation of the puzzle.',
            type: 3,
            required: true,
        },
        {
            name: 'answer',
            description: 'The answer to the puzzle.',
            type: 3,
            required: true,
        },
    ],
}