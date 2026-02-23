import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import error from "./middlewares/error.js";
import skillRouter from "./routes/skillRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(helmet({ contentSecurityPolicy: { directives: { 
    "img-src": ["'self'", "data:", "https:"],
    "script-src": ["'self'", "https:"],
    "connect-src": ["'self'", "https://cdn.jsdelivr.net"],
    "default-src": ["'self'"]
}}}));
app.use(morgan("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(skillRouter);
app.use(error.c404);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
