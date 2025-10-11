const { ActivityType } = require('discord.js');
let currentStatusIndex = 0;

module.exports = (client) => {

    // Activity List
    const statusList = [
        { name: 'LILAC puzzle games', type: ActivityType.Playing },
        { name: 'LILAC Pro Stream', type: ActivityType.Watching },
        { name: 'LILAC News', type: ActivityType.Watching },
        { name: 'Puzzlehunt', type: ActivityType.Competing },
        { name: 'LILAC Development', type: ActivityType.Watching },
        { name: 'LILAC Puzzle Official', type: ActivityType.Watching },
        { name: 'LILAC RPG Game', type: ActivityType.Playing },
        { name: 'LILAC Staff Team', type: ActivityType.Watching },
    ];

    function updateStatus() {
        const newStatus = statusList[currentStatusIndex];

        client.user.setPresence({
            activities: [newStatus],
            status: 'online'
        });

        currentStatusIndex = (currentStatusIndex + 1) % statusList.length;
    }

    updateStatus();

    setInterval(updateStatus, 10000);
};