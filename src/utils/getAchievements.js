const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = () => {
    const achievementFiles = getAllFiles(
        path.join(__dirname, '..', 'achievements')
    );

    const achievements = [];

    for (const file of achievementFiles) {
        const AchievementClass = require(file);
        achievements.push(new AchievementClass());
    }

    return achievements;
};
