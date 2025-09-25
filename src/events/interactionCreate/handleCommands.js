const { devs, testServer } = require('../../../config.json')
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!commandObject) return;

        if (commandObject.devOnly === true) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: "You don't have permission to use this command!",
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.testOnly === true) {
            if (!interaction.guild.id === testServer) {
                interaction.reply({
                    content: "This command can not be used there!",
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "You don't have permission to use this command!",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;
                if (!bot.permissions.has(permission)) {
                    interaction.reply({
                        content: "I do not have permission to use this command!",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }
        await commandObject.callback(client, interaction);
    }catch (error) {
        console.error(error);
    }
};