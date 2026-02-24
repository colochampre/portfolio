import express from "express";
import authController from "../controllers/authController.js";
import auth from "../middlewares/auth.js";
import { body } from "express-validator";

const router = express.Router();

const registerValidation = [
    body("username")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre de usuario debe tener entre 3 y 50 caracteres")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("El nombre de usuario solo puede contener letras, números y guiones bajos"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("confirmPassword")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Las contraseñas no coinciden")
];

const loginValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("El nombre de usuario es requerido"),
    body("password")
        .notEmpty()
        .withMessage("La contraseña es requerida")
];

router.get("/register", auth.redirectIfAuthenticated, authController.showRegister);
router.post("/register", auth.redirectIfAuthenticated, registerValidation, authController.register);

router.get("/login", auth.redirectIfAuthenticated, authController.showLogin);
router.post("/login", auth.redirectIfAuthenticated, loginValidation, authController.login);

router.post("/logout", authController.logout);

router.get("/api/me", auth.requireAuth, authController.getCurrentUser);

export default router;
