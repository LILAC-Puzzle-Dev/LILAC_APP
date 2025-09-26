const { ActivityType } = require('discord.js');
let currentStatusIndex = 0;

module.exports = (client) => {

    // Activity List
    const statusList = [
        { name: 'LILAC puzzle games', type: ActivityType.Playing },
        { name: 'the stars', type: ActivityType.Watching },
        { name: 'LILAC newspaper', type: ActivityType.Watching },
        { name: 'a coding competition', type: ActivityType.Competing },
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