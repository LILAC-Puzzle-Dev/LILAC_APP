const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require('discord.js');
const getAchievements = require('../../utils/getAchievements');
const UserAchievement = require('../../models/UserAchievement');
const AchievementConfig = require('../../models/AchievementConfig');

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
const SECRET_COLOR = '#2c2f33';

function getEnabledAchievements() {
    return getAchievements().filter((a) => !a.isDisabled);
}

function sortByRarity(achievements) {
    return [...achievements].sort(
        (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
    );
}

async function buildAchievementEmbed(achievement, earners) {
    const isRevealed = earners.length > 0;
    const title = achievement.isSecret && !isRevealed
        ? '???'
        : `${achievement.emoji} ${achievement.name}`;
    const description = achievement.isSecret && !isRevealed
        ? '???'
        : achievement.description;
    const color = achievement.isSecret && !isRevealed
        ? SECRET_COLOR
        : achievement.color;

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .addFields(
            { name: 'Rarity', value: achievement.rarity, inline: true },
            { name: 'Category', value: achievement.category, inline: true },
        );

    if (earners.length > 0) {
        let earnerList = earners
            .map((u, i) => {
                const tag = `<@${u.userId}>`;
                return i === 0 ? `👑 ${tag} *(First Earned)*` : tag;
            })
            .join('\n');

        if (earnerList.length > 1024) {
            earnerList = earnerList.substring(0, 1021) + '...';
        }

        embed.addFields({ name: `Earned By (${earners.length})`, value: earnerList });
    } else {
        embed.addFields({ name: 'Earned By', value: 'No one yet!' });
    }

    return embed;
}

async function updateLeaderboard(client, guildId, achievementId) {
    const config = await AchievementConfig.findOne({ guildId });
    if (!config) return;

    const messageId = config.achievementMessages.get(achievementId);
    if (!messageId) return;

    const channel = client.channels.cache.get(config.leaderboardChannelId);
    if (!channel) return;

    let message;
    try {
        message = await channel.messages.fetch(messageId);
    } catch {
        return;
    }

    const achievements = getEnabledAchievements();
    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement) return;

    const earners = await UserAchievement.find({
        obtainedAchievements: achievementId,
    });

    const embed = await buildAchievementEmbed(achievement, earners);

    try {
        await message.edit({ embeds: [embed] });
    } catch (err) {
        console.error(`Failed to update leaderboard for ${achievementId}:`, err);
    }
}

async function runSetup(client, channel, guildId) {
    const achievements = sortByRarity(getEnabledAchievements());

    // Delete old messages if they exist
    const config = await AchievementConfig.findOne({ guildId });
    if (config && config.achievementMessages) {
        const oldChannel = client.channels.cache.get(config.leaderboardChannelId);
        if (oldChannel) {
            for (const [, msgId] of config.achievementMessages) {
                try {
                    const oldMsg = await oldChannel.messages.fetch(msgId);
                    await oldMsg.delete();
                } catch {
                    // Message may already be deleted
                }
            }
        }
    }

    const messageMap = new Map();

    for (const achievement of achievements) {
        const earners = await UserAchievement.find({
            obtainedAchievements: achievement.id,
        });

        const embed = await buildAchievementEmbed(achievement, earners);

        const sent = await channel.send({ embeds: [embed] });
        messageMap.set(achievement.id, sent.id);
    }

    await AchievementConfig.findOneAndUpdate(
        { guildId },
        {
            leaderboardChannelId: channel.id,
            achievementMessages: messageMap,
        },
        { upsert: true },
    );

    return achievements.length;
}

module.exports = {
    name: 'achievements',
    description: 'Achievement system commands.',
    options: [
        {
            name: 'setup',
            description: 'Initialize the Hall of Fame in a channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to use for the achievement leaderboard.',
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
            ],
        },
        {
            name: 'check',
            description: 'Check and claim any achievements you qualify for.',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'list',
            description: "View a user's achievement progress.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'The user to view (defaults to yourself).',
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
        },
    ],

    callback: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();

        // ── SETUP ──
        if (subcommand === 'setup') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: 'You need Administrator permissions to use this command.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            const channel = interaction.options.getChannel('channel');
            const count = await runSetup(client, channel, interaction.guildId);

            return interaction.editReply(`Hall of Fame initialized in <#${channel.id}> with ${count} achievement(s).`);
        }

        // ── CHECK ──
        if (subcommand === 'check') {
            await interaction.deferReply({ ephemeral: true });

            const member = interaction.member;
            let userData = await UserAchievement.findOne({ userId: member.id });

            if (!userData) {
                userData = await UserAchievement.create({ userId: member.id });
            }

            const achievements = getEnabledAchievements();
            const newlyEarned = [];

            for (const achievement of achievements) {
                if (userData.obtainedAchievements.includes(achievement.id)) continue;

                if (achievement.dependsOn && !userData.obtainedAchievements.includes(achievement.dependsOn)) {
                    continue;
                }

                const qualifies = await achievement.check(member, userData);
                if (!qualifies) continue;

                userData.obtainedAchievements.push(achievement.id);
                newlyEarned.push(achievement);

                if (achievement.roleRewards?.length) {
                    for (const roleId of achievement.roleRewards) {
                        try {
                            await member.roles.add(roleId);
                        } catch (err) {
                            console.error(`Failed to add role ${roleId}:`, err);
                        }
                    }
                }
            }

            await userData.save();

            for (const achievement of newlyEarned) {
                await updateLeaderboard(client, interaction.guildId, achievement.id);
            }

            if (newlyEarned.length === 0) {
                return interaction.editReply('No new achievements earned. Keep going!');
            }

            const earned = newlyEarned
                .map((a) => `${a.emoji} **${a.name}** — ${a.description}`)
                .join('\n');

            return interaction.editReply(`🎉 You earned ${newlyEarned.length} new achievement(s)!\n\n${earned}`);
        }

        // ── LIST ──
        if (subcommand === 'list') {
            await interaction.deferReply();

            const targetUser = interaction.options.getUser('user') || interaction.user;
            let userData = await UserAchievement.findOne({ userId: targetUser.id });
            let selfUserData = await UserAchievement.findOne({ userId: interaction.user.id });

            if (!userData) {
                userData = await UserAchievement.create({ userId: targetUser.id });
            }

            const achievements = getEnabledAchievements();
            const grouped = {};

            for (const achievement of achievements) {
                if (!grouped[achievement.category]) {
                    grouped[achievement.category] = [];
                }

                const owned = userData.obtainedAchievements.includes(achievement.id);
                const selfOwned = selfUserData.obtainedAchievements.includes(achievement.id);

                if (achievement.isSecret && !selfOwned) {
                    grouped[achievement.category].push('🔒 ??? [Locked]');
                } else {
                    const status = owned ? '✅' : '⬜';
                    grouped[achievement.category].push(
                        `${status} ${achievement.emoji} **${achievement.name}** — ${achievement.description}`
                    );
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(`${targetUser.username}'s Achievements`)
                .setColor('#9b59b6')
                .setThumbnail(targetUser.displayAvatarURL())
                .setFooter({
                    text: `${userData.obtainedAchievements.length}/${achievements.length} earned`,
                });

            for (const [category, lines] of Object.entries(grouped)) {
                let value = lines.join('\n');
                if (value.length > 1024) {
                    value = value.substring(0, 1021) + '...';
                }
                embed.addFields({ name: category, value });
            }

            return interaction.editReply({ embeds: [embed] });
        }
    },

    runSetup,
};
