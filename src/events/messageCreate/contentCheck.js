module.exports = async (client, message) => {

    if (!message.inGuild() || message.author.bot) return;

    const messageContent = await message.content();

    if (messageContent.includes("LILAC is done")) {
        message.delete();
        message.channel.send({
            content: `${message.author}: Your message is not appropriate according to guild rules!`,
            ephemeral: true,
        })

        const author = message.author;

        author.setTimeout(20000);

        message.channel.send({
            content: `${message.author} has been timed out because of inappropriate behavior!`,
        })
    }

}