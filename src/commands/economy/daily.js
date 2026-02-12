const { Client, Interaction , EmbedBuilder} = require('discord.js');
const User = require('../../models/User');

const baseAmount = 500;
const streakBonus = 100;
const maxStreakBonus = 2000;

module.exports = {
    name: 'daily',
    description: 'Collect your dailies and build your streak!',

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            };

            let user = await User.findOne(query);
            const now = new Date();

            if (user) {
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = now.toDateString();

                if (lastDailyDate === currentDate) {
                    return interaction.editReply(
                        `You have already collected your dailies today. Current Streak: **${user.streak}** days.`
                    );
                }

                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastDailyDate === yesterday.toDateString()) {
                    user.streak += 1;
                } else {
                    user.streak = 1;
                }

                user.lastDaily = now;

            } else {
                user = new User({
                    ...query,
                    lastDaily: now,
                    streak: 1,
                    balance: 0,
                });
            }

            let reward = baseAmount + ((user.streak - 1) * streakBonus);

            if (reward > maxStreakBonus) reward = maxStreakBonus;

            user.balance += reward;
            await user.save();

            const dailyEmbed = new EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle('Daily Reward Collected!')
                .setThumbnail(interaction.user.displayAvatarURL())
                .addFields(
                    { name: 'Total Reward', value: `\`$${reward}\``, inline: true },
                    { name: 'Current Streak', value: `\`${user.streak} Days\` 🔥`, inline: true },
                    { name: 'New Balance', value: `\`$${user.balance}\``, inline: false },
                    {
                        name: 'Reward Breakdown',
                        value: `Base: $${baseAmount}\nStreak Bonus: +$${reward - baseAmount}`,
                        inline: false
                    }
                )
                .setFooter({ text: 'Keep the streak going for more rewards!' })
                .setTimestamp();

            await interaction.editReply({ embeds: [dailyEmbed] });

        } catch (error) {
            console.log(`Error with /daily: ${error}`);
            interaction.editReply('There was an error claiming your daily reward.');
        }
    },
};