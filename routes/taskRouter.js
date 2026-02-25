import { Router } from "express";
import taskController from "../controllers/taskController.js";
import auth from "../middlewares/auth.js";

const routes = Router();

routes.get("/tasks", taskController.getAll);
routes.get("/tasks/add", taskController.getAddForm);
routes.post("/tasks/add", taskController.create);
routes.get("/tasks/edit/:id", taskController.getEditForm);
routes.post("/tasks/edit/:id", taskController.update);
routes.post("/tasks/delete/:id", taskController.delete);
routes.post("/tasks/complete/:id", taskController.complete);
routes.post("/tasks/uncomplete/:id", taskController.uncomplete);

export default routes;
