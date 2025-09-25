const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DS_KEY,
});

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;
    const channels = ['1396659149818953830']
    if (!channels.includes(message.channelId)) return;

    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(() => {
        message.channel.sendTyping();
    }, 5000)

    let conversation = [];
    conversation.push({
        role: 'system',
        content: 'Deepseek is a smart GPT.',
    });

    let prevMessages = await message.channel.messages.fetch({
        limit: 10,
    });
    prevMessages.reverse();
    prevMessages.forEach((message) => {
        if (message.author.bot && message.author.id !== client.user.id) return;

        const username = message.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        if (message.author.id === client.user.id) {
            conversation.push({
                role: 'assistant',
                name: username,
                content: message.content,
            });

            return;
        }

        conversation.push({
            role: 'user',
            name: username,
            content: message.content,
        })
    })

    const response = await openai.chat.completions.create({
        model: "deepseek-reasoner",
        messages: conversation,
    }).catch((error) => console.log(error));

    clearInterval(sendTypingInterval);

    if (!response) {
        message.reply("The GPT failed to send a response! Try again later.");
        return;
    }

    const responseMessage = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    for (let i = 0; i < responseMessage.length; i += chunkSizeLimit) {
        const chunk = responseMessage.substring(i, i + chunkSizeLimit);

        await message.reply(chunk);
    }
}