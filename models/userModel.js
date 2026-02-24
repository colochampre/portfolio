import pool from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userModel = {
    create: async (username, password) => {
        try {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const [result] = await pool.query(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                [username, hashedPassword]
            );
            return { id: result.insertId, username };
        } catch (error) {
            throw error;
        }
    },

    findByUsername: async (username) => {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM users WHERE username = ?",
                [username]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const [rows] = await pool.query(
                "SELECT id, username, created_at FROM users WHERE id = ?",
                [id]
            );
            return rows[0] || null;
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
            const [rows] = await pool.query(
                "SELECT COUNT(*) as count FROM users WHERE username = ?",
                [username]
            );
            return rows[0].count > 0;
        } catch (error) {
            throw error;
        }
    }
};

export default userModel;
