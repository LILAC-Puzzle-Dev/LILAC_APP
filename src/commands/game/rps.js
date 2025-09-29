const { Client, Interaction, PermissionFlagsBits } = require('discord.js');

const choices = [
    { name: 'Rock', emoji: '' }
]

module.exports = {
    /**
     *
     * @param client
     * @param interaction
     */
    callback: async (client, interaction) => {
        try {

        }catch (error) {
            console.error(error);
        }
    },

    name: 'rps',
    description: 'Play rock paper scissors with another member.',
    dmPermission: false,
    options: [{
        name: "member",
        description: "The member you want to play with.",
        type: 6,
        required: true,
    }]
}