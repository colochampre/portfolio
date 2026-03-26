import pool from "../config/db.js";

// XP required to go from level N to level N+1
export const getXpToNextLevel = (level) => {
    return 100 * Math.pow(level, 2) + 200 * level + 200;
    // Level 1->2: 500, Level 2->3: 800, Level 3->4: 1100, etc.
};

// Get current XP within level (xp column now stores XP within current level, not total)
export const getCurrentLevelXp = (xp) => {
    return xp; // XP is now stored as progress within current level
};

const playerStatsModel = {
    getOrCreate: async (userId) => {
        try {
            const result = await pool.query(
                "SELECT * FROM player_stats WHERE user_id = $1",
                [userId]
            );
            
            if (result.rows[0]) {
                return result.rows[0];
            }
            
            const insertResult = await pool.query(
                "INSERT INTO player_stats (user_id) VALUES ($1) RETURNING *",
                [userId]
            );
            return insertResult.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getByUserId: async (userId) => {
        try {
            const result = await pool.query(
                "SELECT * FROM player_stats WHERE user_id = $1",
                [userId]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    },

    getByUsername: async (username) => {
        try {
            const result = await pool.query(
                `SELECT ps.*, u.username 
                 FROM player_stats ps 
                 JOIN users u ON ps.user_id = u.id 
                 WHERE u.username = $1`,
                [username]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    },

    updateStats: async (userId, { goals = 0, assists = 0, isWin = false, isLoss = false, isDraw = false, xpGained = 0 }) => {
        try {
            const stats = await playerStatsModel.getOrCreate(userId);
            
            // XP within current level + new XP gained
            let currentXp = stats.xp + xpGained;
            let currentLevel = stats.level;
            let xpForNextLevel = getXpToNextLevel(currentLevel);
            
            // Level up while we have enough XP (allows multiple level-ups at once)
            while (currentXp >= xpForNextLevel) {
                currentLevel++;
                currentXp -= xpForNextLevel;
                xpForNextLevel = getXpToNextLevel(currentLevel);
            }
            
            await pool.query(
                `UPDATE player_stats SET 
                    goals = goals + $1,
                    assists = assists + $2,
                    matches = matches + 1,
                    wins = wins + $3,
                    losses = losses + $4,
                    draws = draws + $5,
                    xp = $6,
                    level = $7
                WHERE user_id = $8`,
                [
                    goals,
                    assists,
                    isWin ? 1 : 0,
                    isLoss ? 1 : 0,
                    isDraw ? 1 : 0,
                    currentXp,
                    currentLevel,
                    userId
                ]
            );
            
            return { leveledUp: currentLevel > stats.level, newLevel: currentLevel, newXp: currentXp };
        } catch (error) {
            throw error;
        }
    },

    getRanking: async (limit = 50, offset = 0, sortBy = 'wilson', sortDir = 'default') => {
        try {
            const z = 1.96; // 95% confidence interval
            
            // Define default directions for each sort type
            const defaultDirs = {
                wilson: 'desc',
                username: 'asc',
                level: 'desc',
                matches: 'desc',
                record: 'desc',
                winrate: 'desc',
                goals: 'desc',
                assists: 'desc'
            };
            
            // Use provided direction or default
            const dir = sortDir === 'default' ? defaultDirs[sortBy] || 'desc' : sortDir;
            const isAsc = dir === 'asc';
            const primaryDir = isAsc ? 'ASC' : 'DESC';
            const secondaryDir = isAsc ? 'DESC' : 'ASC'; // Opposite for secondary sorts
            
            // Build ORDER BY clause based on sortBy parameter
            let orderClause;
            switch (sortBy) {
                case 'username':
                    orderClause = `u.username ${primaryDir}`;
                    break;
                case 'level':
                    orderClause = `ps.level ${primaryDir}, ps.xp ${primaryDir}`;
                    break;
                case 'matches':
                    orderClause = `ps.matches ${primaryDir}`;
                    break;
                case 'record':
                    orderClause = isAsc 
                        ? 'ps.wins ASC, ps.losses DESC' 
                        : 'ps.wins DESC, ps.losses ASC';
                    break;
                case 'winrate':
                    orderClause = `winrate ${primaryDir}, ps.matches ${primaryDir}`;
                    break;
                case 'goals':
                    orderClause = `ps.goals ${primaryDir}`;
                    break;
                case 'assists':
                    orderClause = `ps.assists ${primaryDir}`;
                    break;
                case 'wilson':
                default:
                    // Wilson Score Lower Bound formula (PostgreSQL syntax)
                    orderClause = `(
                        (ps.wins::DECIMAL / ps.matches + (${z}*${z}) / (2 * ps.matches)) - 
                        ${z} * SQRT(
                            ( (ps.wins::DECIMAL / ps.matches) * (1 - (ps.wins::DECIMAL / ps.matches)) + (${z}*${z}) / (4 * ps.matches) ) / ps.matches
                        )
                    ) / (1 + (${z}*${z}) / ps.matches) ${primaryDir}`;
                    break;
            }
            
            const result = await pool.query(
                `SELECT 
                    ps.*,
                    u.username,
                    CASE WHEN ps.matches > 0 THEN ROUND((ps.wins::DECIMAL / ps.matches) * 100, 1) ELSE 0 END as winrate
                FROM player_stats ps
                JOIN users u ON ps.user_id = u.id
                WHERE ps.matches > 0
                ORDER BY ${orderClause}
                LIMIT $1 OFFSET $2`,
                [limit, offset]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getTotalPlayersWithMatches: async () => {
        try {
            const result = await pool.query(
                "SELECT COUNT(*) as total FROM player_stats WHERE matches > 0"
            );
            return parseInt(result.rows[0].total);
        } catch (error) {
            throw error;
        }
    },

    getPlayerRank: async (userId) => {
        try {
            const result = await pool.query(
                `SELECT COUNT(*) + 1 AS rank
                FROM player_stats ps1
                JOIN player_stats ps2 ON ps2.user_id = $1
                WHERE ps1.matches > 0 
                AND (ps1.level > ps2.level OR (ps1.level = ps2.level AND ps1.xp > ps2.xp))`,
                [userId]
            );
            return parseInt(result.rows[0].rank);
        } catch (error) {
            throw error;
        }
    }
};

export default playerStatsModel;
