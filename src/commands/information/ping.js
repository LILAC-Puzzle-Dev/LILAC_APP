module.exports = {
    name: 'ping',
    description: 'Check LILAC APP ping status.',
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Client ping: ${ping}ms | Websocket ping: ${client.ws.ping}ms`);
    }
}