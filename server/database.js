export async function getPlayerStats(username) {
    return { username, level: 1, xp: 0 };
}

export function getXpToNextLevel(level) {
    return level * 100;
}
