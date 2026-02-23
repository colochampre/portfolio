import { Router } from "express";
import skill from "../controllers/skillController.js";

const routes = Router();

routes.get("/", skill.getAll);
routes.get("/skill-add", skill.getAddForm);
routes.post("/skill-add", skill.create);
routes.get("/skill-edit/:id", skill.getEditForm);
routes.post("/skill-edit/:id", skill.update);
routes.post("/skill-delete/:id", skill.delete);

export default routes;
