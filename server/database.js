export async function getPlayerStats(username) {
    return { username, level: 1, xp: 0 };
}

export const getTotalXpForLevel = (level) => {
    return 100 * Math.pow(level, 2) + 200 * level - 300; // 500, 1200, 2100, 3200, 4500, 6000, 7700, 9600, 11700
};

export const getXpToNextLevel = (level) => {
    const xpCurrentLevel = getTotalXpForLevel(level);
    const xpNextLevel = getTotalXpForLevel(level + 1);
    return xpNextLevel - xpCurrentLevel;
};
