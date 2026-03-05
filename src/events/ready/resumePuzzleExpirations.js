const { resumeExpirations } = require('../../utils/puzzleExpirationScheduler');

module.exports = async (client) => {
    await resumeExpirations();
};
