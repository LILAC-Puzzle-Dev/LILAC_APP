module.exports = async (client, interaction) => {

    if (!interaction.isStringSelectMenu()){
        return;
    }

    if (interaction.customId === 'role-info-select-menu'){

        const selectedValue = interaction.values[0];

        const sendChannel = await client.channels.cache.get('1420392656055308422');

        let messageEmbed;

        if (selectedValue === 'staff-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Staff Roles',
                description: `Roles for management purpose. Do **NOT** ping them directly.

**<@&1397010007412838400>**
> LILAC official Discord account.

**<@&1416319348855013427>**
> Official server management application.

**<@&1395592329913438239>**
**<@&1426210171297726494>**
**<@&1426210340970037400>**
**<@&1395665478583586896>**
**<@&1426210680104685678>**
**<@&1426210853157470278>**
> Staff of the discord server. Trail Moderator application will be available soon.

**<@&1426213206145110026>**
> Moderates the VCs. Application will be available soon.

**<@&1395778347811733565>**
> Software development team from LILAC.`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'auto-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Auto Roles',
                description: `Most of these roles are available in **<#1420392583690981396>**.

**<@&1417146504459583529>**
> Get notified for big announcements and events relating to LILAC.

**<@&1419145191486656714>**
> Get notified for LILAC Puzzle Official server updates and information in the future.

**<@&1419144798564126742>**
> Get notified for large giveaways and events.

**<@&1419144798564126742>**
> Get notified for new puzzles and quiz.

**<@&1417146815563698349>**
> Get notified of upcoming LILAC events hosted by the Event Committee.`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'activity-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Activity Roles',
                description: `These roles will be automatically assigned when you qualify.

Coming Soon...`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'tatsu-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Tatsu Roles',
                description: `These roles are automatically assigned when you reach the required chat score.

**<@&1427629641799172179>**
> 5,000 chat score.

**<@&1427630186630746244>**
> 10,000 chat score.

**<@&1427630272064782356>**
> 25,000 chat score.

**<@&1428651374832390296>**
> 50,000 chat score.

**<@&1427630354486919208>**
> 100,000 chat score.

**<@&1427630888426143855>**
> 200,000 chat score.

**<@&1427631029258027160>**
> 350,000 chat score.

**<@&1427631543299342506>**
> 500,000 chat score.

**<@&1427631780931829810>**
> 725,000 chat score.

**<@&1427631914264559616>**
> 1,000,000 chat score.

**<@&1427632067059122246>**
> 1,500,000 chat score.`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'vc-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'VC Roles',
                description: `These roles are automatically assigned when you reach the required voice chat minutes.

**<@&1427634016466636892>**
> 900 VC Minutes / 15 VC Hours.

**<@&1427634082048774185>**
> 5,400 VC Minutes / 90 VC Hours.

**<@&1427634155100966912>**
> 10,400 VC Minutes / 173.3 VC Hours.

**<@&1427634274508603413>**
> 25,200 VC Minutes / 420 VC Hours.

**<@&1427634364988133416>**
> 49,500 VC Minutes / 825 VC Hours.`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'donation-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Donation Roles',
                description: `Contribute funds/items to Giveaways or Events. Open a Ticket in <#1395684979387928699> to donate. All transactions are tracked and a higher ranking role will be given when a new threshold is met. Donation thresholds slowly go up to account for inflation. **We preserve the right to give items away where we see fit**.

All items will however be given away in a fair manner with everyone participating receiving an equal chance to win (except people with <@&1427929179063717919> role).

**Please be 100% sure you are willing to give away before submitting funds/items, there will be no refunds**.

**<@&1427636488681554074>**
> Threshold Coming Soon...

**<@&1427636439323250809>**
> Threshold Coming Soon...

**<@&1427636358754861147>**
> Threshold Coming Soon...

**<@&1427636273199190016>**
> Threshold Coming Soon...

**<@&1427636139681910795>**
> Threshold Coming Soon...

**<@&1427636019284414474>**
> Threshold Coming Soon...

**<@&1427635530916433990>**
> Threshold Coming Soon...

**<@&1427635445008830535>**
> ???`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'server-subscription-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Server Subscription Roles',
                description: `These roles will be automatically assigned when you purchase a server subscription.

Coming Soon...`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'puzzle-mastery-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Puzzle Mastery Roles',
                description: `These roles will be automatically assigned when you complete certain amount of puzzles.

**<@&1427638740951502910>**
> Threshold Coming Soon...

**<@&1427638934443397141>**
> Threshold Coming Soon...

**<@&1427639133664182445>**
> Threshold Coming Soon...

**<@&1427639140102574160>**
> Threshold Coming Soon...

**<@&1427639145530134599>**
> Threshold Coming Soon...

**<@&1427639149833359511>**
> Threshold Coming Soon...`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'color-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Color Roles',
                description: `Coming Soon...`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'symbol-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Symbol Roles',
                description: `Coming Soon...`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'exclusive-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Exclusive Roles',
                description: `Coming Soon...`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (selectedValue === 'other-roles'){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Other Roles',
                description: `Coming Soon...`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        if (!messageEmbed){
            messageEmbed = {
                color: 0xd8e2dc,
                title: 'Something Went Wrong',
                description: `Contact staff for support.`,
                footer: {
                    text: `LILAC Puzzle Official`
                },
            };
        }

        try {

            interaction.reply({
                content: '',
                embeds: [messageEmbed],
                ephemeral: true,
            })

        }catch(error){
            console.log(error);
        }

    }

}