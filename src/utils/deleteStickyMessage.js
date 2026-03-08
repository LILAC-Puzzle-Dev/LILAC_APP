/**
 * Deletes a previously posted sticky message from a channel.
 * @param {import('discord.js').TextBasedChannel} channel - The channel the message is in.
 * @param {string} messageId - The ID of the message to delete.
 */
async function deleteStickyMessage(channel, messageId) {
    if (!messageId) return;
    const previous =
        channel.messages.cache.get(messageId) ||
        await channel.messages.fetch(messageId).catch(() => null);
    if (previous) await previous.delete().catch(() => null);
}

module.exports = { deleteStickyMessage };
