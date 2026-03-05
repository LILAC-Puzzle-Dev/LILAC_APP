const PuzzleGame = require('../models/PuzzleGame');

const MAX_TIMEOUT_MS = 2147483647; // setTimeout max (~24.8 days)
const timers = new Map();

async function expireGame(customId) {
    try {
        const game = await PuzzleGame.findOne({ custom_id: customId });
        if (!game || game.status !== 'active') return;

        game.status = 'inactive';
        game.expires_at = null;
        await game.save();

        console.log(`[PuzzleExpiration] Game "${customId}" automatically set to inactive after expiration.`);
    } catch (error) {
        console.error(`[PuzzleExpiration] Error expiring game "${customId}":`, error);
    } finally {
        timers.delete(customId);
    }
}

async function scheduleExpiration(customId, expiresAt) {
    cancelExpiration(customId);

    const delay = expiresAt.getTime() - Date.now();

    if (delay <= 0) {
        await expireGame(customId);
        return;
    }

    if (delay > MAX_TIMEOUT_MS) {
        const handle = setTimeout(() => scheduleExpiration(customId, expiresAt), MAX_TIMEOUT_MS);
        timers.set(customId, handle);
        return;
    }

    const handle = setTimeout(() => expireGame(customId), delay);
    timers.set(customId, handle);
    console.log(`[PuzzleExpiration] Scheduled expiration for "${customId}" in ${Math.round(delay / 1000)}s.`);
}

function cancelExpiration(customId) {
    if (timers.has(customId)) {
        clearTimeout(timers.get(customId));
        timers.delete(customId);
        console.log(`[PuzzleExpiration] Cancelled expiration timer for "${customId}".`);
    }
}

async function resumeExpirations() {
    try {
        const activeGames = await PuzzleGame.find({
            status: 'active',
            expires_at: { $ne: null, $exists: true },
        });

        for (const game of activeGames) {
            await scheduleExpiration(game.custom_id, game.expires_at);
        }

        if (activeGames.length > 0) {
            console.log(`[PuzzleExpiration] Resumed ${activeGames.length} expiration timer(s) on startup.`);
        }
    } catch (error) {
        console.error('[PuzzleExpiration] Error resuming expirations on startup:', error);
    }
}

module.exports = { scheduleExpiration, cancelExpiration, resumeExpirations };
