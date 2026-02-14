const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'credits',
    description: 'See the credits of LILAC APP and LILAC Puzzle Official.',

    callback: async (client, interaction) => {
        const creditsEmbed = new EmbedBuilder()
            .setColor('#BD93F9')
            .setTitle('💜 LILAC APP Credits')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
                'LILAC APP is the main management tool for [LILAC Puzzle Official](https://discord.gg/ANNqeX82XR). ' +
                'It provides supervision methods for the staff team and essential interaction handlers for the community.'
            )
            .addFields(
                {
                    name: 'LILAC Development Team',
                    value: '• YC_Eagle\n• Trilleo\n• KoolShow\n• Ian\n• Bulaisien',
                    inline: false
                },
                {
                    name: 'LILAC Staff Team',
                    value: '• YC_Eagle',
                    inline: true
                },
                {
                    name: 'Service Providers',
                    value:
                        '• **API**: [Discord.js](https://discord.js.org/)\n' +
                        '• **Database**: [MongoDB](https://www.mongodb.com/)\n' +
                        '• **AI Structure**: [OpenAI](https://openai.com/)\n' +
                        '• **AI API**: [DeepSeek](https://deepseek.com/)\n' +
                        '• **Archive**: [Trilleo Network](https://trilleo.net/)',
                    inline: false
                }
            )
            .setFooter({ text: 'LILAC Puzzle Official • All Rights Reserved' })
            .setTimestamp();

        await interaction.reply({ embeds: [creditsEmbed] });
    },
};