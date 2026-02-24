import { Router } from "express";
import exampleController from "../controllers/exampleController.js";

const routes = Router();

routes.get("/", exampleController.getAll);
routes.get("/skill-add", exampleController.getAddForm);
routes.post("/skill-add", exampleController.create);
routes.get("/skill-edit/:id", exampleController.getEditForm);
routes.post("/skill-edit/:id", exampleController.update);
routes.post("/skill-delete/:id", exampleController.delete);

export default routes;
