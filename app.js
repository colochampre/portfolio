import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import taskController from "./controllers/taskController";
import errorController from "./controllers/errorController";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
const port = 3000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", taskController.getAllTasks);
app.get("/add", taskController.getAddTaskForm);
app.post("/add", taskController.addTask);
app.get("/edit/:id", taskController.getEditTaskForm);
app.post("/edit/:id", taskController.editTask);
app.post("/complete/:id", taskController.completeTask);
app.post("/uncomplete/:id", taskController.uncompleteTask);
app.post("/delete/:id", taskController.deleteTask);

app.use(errorController.error404);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
