import pool from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userModel = {
    create: async (username, password, role = 'user') => {
        try {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const result = await pool.query(
                "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
                [username, hashedPassword, role]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    findByUsername: async (username) => {
        try {
            const result = await pool.query(
                "SELECT * FROM users WHERE username = $1",
                [username]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await pool.query(
                "SELECT id, username, role, created_at FROM users WHERE id = $1",
                [id]
            );
            return result.rows[0] || null;
        } catch (error) {
            throw error;
        }
    },

    validatePassword: async (plainPassword, hashedPassword) => {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw error;
        }
    },

    usernameExists: async (username) => {
        try {
            const result = await pool.query(
                "SELECT COUNT(*) as count FROM users WHERE username = $1",
                [username]
            );
            return parseInt(result.rows[0].count) > 0;
        } catch (error) {
            throw error;
        }
    },

    updateRole: async (userId, role) => {
        try {
            await pool.query(
                "UPDATE users SET role = $1 WHERE id = $2",
                [role, userId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
};

export default userModel;
