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
    }
};

export default auth;
