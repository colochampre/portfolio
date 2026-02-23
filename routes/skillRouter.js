import { Router } from "express";
import skill from "../controllers/skillController.js";

const routes = Router();

routes.get("/", skill.getAll);
routes.get("/add-skill", skill.getAddForm);
routes.post("/add-skill", skill.create);
routes.get("/edit-skill/:id", skill.getEditForm);
routes.post("/edit-skill/:id", skill.update);
routes.post("/delete-skill/:id", skill.delete);

export default routes;
