const Captcha = require('../../utils/captcha');

module.exports = {
    name: 'captcha',
    description: 'Test the CAPTCHA verification system.',

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const member = interaction.member;
        const channel = interaction.channel;

        const success = await Captcha.run(channel, member);

        if (success) {
            await interaction.editReply('✅ CAPTCHA passed! Verification successful.');
        } else {
            await interaction.editReply('❌ CAPTCHA failed. You either answered incorrectly or ran out of time.');
        }
    },
};
