const Suggestion = require('../../models/Suggestion');
const formatSuggestionResults = require('../../utils/formatSuggestionResults')

module.exports = async (client, interaction) => {

    if (!interaction.isButton() || !interaction.customId) return;

    try {

        const [type, suggestionId, action] = interaction.customId.split(".");

        if (!type || !suggestionId || !action) return;
        if (type !== "suggestion") return;

        await interaction.deferReply({ ephemeral: true });

        const targetSuggestion = await Suggestion.findOne({ suggestionId });
        const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
        const targetMessageEmbed = targetMessage.embeds[0];

        const hasStaffRole = interaction.member.roles.cache.has('1395665478583586896');

        if (action === "approve"){
            if (!hasStaffRole) {
                await interaction.editReply("You don't have permission to approve this suggestion.");
                return;
            };

            targetSuggestion.status = "approved";
            targetMessageEmbed.data.color = 0x84e660;
            targetMessageEmbed.fields[1].value = "✅ Approved";

            await targetSuggestion.save();

            interaction.editReply("Suggestion approved!");

            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [targetMessage.components[0]],
            });

            return;
        }

        if (action === "reject") {
            if (!hasStaffRole) {
                await interaction.editReply("You don't have permission to reject this suggestion.");
                return;
            };

            targetSuggestion.status = "rejected";
            targetMessageEmbed.data.color = 0xff6161;
            targetMessageEmbed.fields[1].value = "❌ Rejected";

            await targetSuggestion.save();

            interaction.editReply("Suggestion rejected!");

            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [targetMessage.components[0]],
            });

            return;
        }

        const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);

        if (action === "upvote"){

            if (hasVoted){
                await interaction.editReply("You have already voted.");
                return;
            }

            targetSuggestion.upvotes.push(interaction.user.id);

            await targetSuggestion.save();

            interaction.editReply("Upvoted suggestion!");

            targetMessageEmbed.fields[2].value = formatSuggestionResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });

            return;
        }

        if (action === "downvote"){

            if (hasVoted){
                await interaction.editReply("You have already voted.");
                return;
            }

            targetSuggestion.downvotes.push(interaction.user.id);

            await targetSuggestion.save();

            interaction.editReply("Downvoted suggestion!");

            targetMessageEmbed.fields[2].value = formatSuggestionResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });

            return;
        }

    }catch (error) {
        console.error(error);
    }

}