import userModel from "../models/userModel.js";
import jwtConfig from "../config/jwt.js";
import { validationResult } from "express-validator";

const authController = {
    showRegister: (req, res) => {
        res.render("register", { 
            title: "Registro - Snake Soccer",
            error: null 
        });
    },

    showLogin: (req, res) => {
        res.render("login", { 
            title: "Login - Snake Soccer",
            error: null 
        });
    },

    register: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("register", {
                title: "Registro - Snake Soccer",
                error: errors.array()[0].msg
            });
        }

        const { username, password } = req.body;

        try {
            const exists = await userModel.usernameExists(username);
            if (exists) {
                return res.status(400).render("register", {
                    title: "Registro - Snake Soccer",
                    error: "El nombre de usuario ya está en uso"
                });
            }

            const user = await userModel.create(username, password);
            
            const token = jwtConfig.generateToken({ 
                id: user.id, 
                username: user.username 
            });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.redirect("/");
        } catch (error) {
            console.error("Error en registro:", error);
            res.status(500).render("register", {
                title: "Registro - Snake Soccer",
                error: "Error al crear el usuario"
            });
        }
    },

    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("login", {
                title: "Login - Snake Soccer",
                error: errors.array()[0].msg
            });
        }

        const { username, password } = req.body;

        try {
            const user = await userModel.findByUsername(username);
            
            if (!user) {
                return res.status(401).render("login", {
                    title: "Login - Snake Soccer",
                    error: "Usuario o contraseña incorrectos"
                });
            }

            const isValidPassword = await userModel.validatePassword(password, user.password);
            
            if (!isValidPassword) {
                return res.status(401).render("login", {
                    title: "Login - Snake Soccer",
                    error: "Usuario o contraseña incorrectos"
                });
            }

            const token = jwtConfig.generateToken({ 
                id: user.id, 
                username: user.username 
            });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.redirect("/");
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).render("login", {
                title: "Login - Snake Soccer",
                error: "Error al iniciar sesión"
            });
        }
    },

    logout: (req, res) => {
        res.clearCookie("token");
        res.redirect("/login");
    },

    getCurrentUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            res.json({ user });
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            res.status(500).json({ error: "Error al obtener usuario" });
        }
    }
};

export default authController;
