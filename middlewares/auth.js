import jwtConfig from "../config/jwt.js";

const auth = {
    requireAuth: (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        const decoded = jwtConfig.verifyToken(token);

        if (!decoded) {
            res.clearCookie("token");
            return res.redirect("/login");
        }

        req.user = decoded;
        next();
    },

    isAuthenticated: (req, res, next) => {
        const token = req.cookies.token;

        if (token) {
            const decoded = jwtConfig.verifyToken(token);
            if (decoded) {
                req.user = decoded;
            }
        }

        next();
    },

    redirectIfAuthenticated: (req, res, next) => {
        const token = req.cookies.token;

        if (token) {
            const decoded = jwtConfig.verifyToken(token);
            if (decoded) {
                return res.redirect("/");
            }
        }

        next();
    },

    requireAdmin: (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        const decoded = jwtConfig.verifyToken(token);

        if (!decoded) {
            res.clearCookie("token");
            return res.redirect("/login");
        }

        if (decoded.role !== 'admin') {
            return res.status(403).render("error", {
                title: "Acceso Denegado",
                message: "No tienes permisos de administrador para acceder a esta página"
            });
        }

        req.user = decoded;
        next();
    }
};

export default auth;
