const Level = require('../../models/Level');
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const {AttachmentBuilder} = require("discord.js");

module.exports = {
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply('You can only run this command inside a server.');
            return;
        }

        await interaction.deferReply();
        const mentionedUserId = interaction.options.get('member')?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        })

        if (!fetchedLevel) {
            interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} does not have a level yet.` : "You do not have a level yet."
            );
            return;
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');
        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        })

        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;
        const { Font } = require('canvacord');
        Font.loadDefault();

        const rank = new canvacord.RankCardBuilder()
            .setAvatar(targetUserObj.user.displayAvatarURL({ size: 512 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setUsername(targetUserObj.user.username)
            .setTextStyles({
                level: "LEVEL:",
                xp: "EXP:",
                rank: "RANK:",
            })
            .setStyles({
                progressbar: {
                    thumb: {
                        style: {
                            backgroundColor: '#fefae0',
                        },
                    },
                },
            })

        const image = await rank.build({ format: 'png',});
        const attachment = new AttachmentBuilder(image);
        interaction.editReply({
            content: "The card looks weird, but we are working to improve it!",
            files: [attachment]
        });
    },

    name: "level",
    description: "Show a member's chat level.",
    options: [
        {
            name: "member",
            description: "The member who you want to check.",
            type: 9,
            required: false,
        }
    ],
    deleted: true,
}