require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const roles = [
    {
        id: '1395667039250550865',
        customId: "001",
        label: 'Verify',
    }
]

const messageEmbed = {
    color: 0x588157,
    title: 'General server rules',
    description: 'Please read the following entries, and make sure that you agree to all of them.',
    fields: [
        {
            name: '1. Respect the members of this guild.',
            value: 'Your messages should not contain any offensive words. Everyone in this guild deserves a harmonious environment. Sometimes the moderators may be busy, so reactions will be slow frequently. Do not spam ping and be patient.',
        },
        {
            name: '2. Follow the topic of each channel.',
            value: 'Every channels in this guild has a specific topic. Talking about irrelated topic is not recommended. If you want more topic to be added into this guild, make a post in the #suggestions channel.',
        },
        {
            name: '3. Respect the copyright of LILAC.',
            value: 'The puzzles in this guild is possible with all the efforts from our creators. Please always ask for our permission before copying any official contents. Heavy punishment may follow if you spread the puzzles without notifying us.'
        },
        {
            name: '4. '
        },
    ],
    timestamp: new Date().toISOString(),
    footer: {
        text: 'LILAC Official',
    },
};




//Verify message

/*
client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1395765809871061002');
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel(role.label)
                    .setCustomId(role.id),
            )
        })

        await channel.send({
            embeds: [messageEmbed],
            components: [row],
        })
        process.exit();
    } catch (error){
        console.log(error);
    }
})
*/

//Rules
/*
client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1395608172944687247');
        if (!channel) return;

        await channel.send({
            content: `**General Rules**

1. Be respectful and tolerant, and refrain from harassing anyone or being rude in general. Profanity in itself is tolerated on a moderate level, as long as it's not directed to a person or group. 

2. LILAC Puzzle Official only uses English for interaction between users. You're not allowed to use any other language in any channel.

3. No Spamming & Raiding on the server.

4. Do not send any form of advertisement in LILAC Puzzle Official.

5. We do not tolerate anything that incites controversy. (This includes topics like Politics, Religion, Cheating, E-Dating, etc.)

6. Please stay on topic with the channel you are in when told.

7. Scamming is prohibited in our discord. Should you scam or attempt to scam, you will be permanently banned.

8. Do not post any inappropriate content on our discord whatsoever. This includes text, images or links that are NSFW, NSFL, dangerous, racist, offensive, or that incite any sort of potential severe negativity.

9. Do not participate in any form of Defamation or a Witch Hunt against anyone, be it someone in LILAC Puzzle Official, or anywhere else.

10. Do not attempt to make any moves at Filter Bypassing. This will result in a punishment.`,
        })
        process.exit();
    } catch (error){
        console.log(error);
    }
})
*/
/*
client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1395608172944687247');
        if (!channel) return;

        await channel.send({
            content: `\n11. Read out the subsequent channel rules, usually found in the pinned messages or channel specific rules.

12. Any form of illegal & disallowed trading/service inside of LILAC Puzzle Official is subject to a punishment.

13. Please refrain from sharing any personal information whatsoever inside the server.

14. Please do not include any of the official LILAC Puzzle Official Symbols in your discord name/nickname. This is exclusive for Staff only.

15. Please do not bypass any of the rules aforementioned by using your LILAC Puzzle Official nickname perms or Discord Status/About me and Profile Pictures. 

16. Staff may moderate any channels at their discretion, with proper common sense & understanding of the situation.

17. Follow everything that you have agreed on with Discord's own set of rules and terms of service.

18. Follow the adequate voice channel guidelines shown here.
    - Do not be racist or homophobic.
    - Do not earrape.
    - Do not raid VC's
    - Do not be toxic.
    - Only talk English in LILAC Puzzle Official VC's. (Rule #2)`,
        })
        process.exit();
    } catch (error){
        console.log(error);
    }
})
*/
/*
client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1395608172944687247');
        if (!channel) return;

        await channel.send({
            content: `**LILAC-Puzzle-Specific Rules**

1. All content produced by LILAC Puzzle Official in any form (including but not limited to text, pictures, audio, video) is protected by law and, unless otherwise specified, complies with the CC-BY-NC-ND 4.0 Creative Commons License. Users must credit the author and may not modify the original work. You can't take the content for commercial use. It should be noted that the sidebar is also an important part of the puzzle, and simply cutting off the sidebar is also considered an infringement.

2. All content you contribute to LILAC Puzzle Official will be deemed to have all copyrights transferred to LILAC Puzzle Official.`,
        })
        process.exit();
    } catch (error){
        console.log(error);
    }
})
*/
/*
client.on('ready', async (c) => {
    try {
        const channel = await client.channels.cache.get('1395608172944687247');
        if (!channel) return;

        await channel.send({
            content: `**IMPORTANT**

All of the rules above are subject to change at any time, and thus will be regularly updated every so often. If you are found to be breaking any of our rules, staff reserve the right to punish you appropriately.`,
        })
        process.exit();
    } catch (error){
        console.log(error);
    }
})
*/

client.login(process.env.TOKEN);