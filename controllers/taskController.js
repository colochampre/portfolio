import taskModel from "../models/taskModel.js";
import error from "../middlewares/error.js";

const taskController = {
    getAll: async (req, res) => {
        try {
            let tasks = await taskModel.getAll();
            res.render("tasks", { tasks, title: "Tareas pendientes" });
        } catch (err) {
            error.c500(req, res, err);
        }
    },

    getAddForm: (req, res) => {
        res.render("tasks/add", { title: "Agregar Tarea" });
    },

    create: async (req, res) => {
        try {
            let { name } = req.body;
            await taskModel.create(name);
            res.redirect("/tasks");
        } catch (err) {
            error.c500(req, res, err);
        }
    },

    getEditForm: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            let task = await taskModel.getTask(id);

            if (!task) {
                error.c404(req, res);
            } else {
                res.render("tasks/edit", { title: "Editar Tarea", task });
            }
        } catch (err) {
            error.c500(req, res, err);
        }
    },

    update: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            let name = req.body.name;
            await taskModel.update(id, name);
            res.redirect("/tasks");
        } catch (err) {
            error.c500(req, res, err);
        }
    },
    complete: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            await taskModel.complete(id);
            res.redirect("/tasks");
        } catch (err) {
            error.c500(req, res, err);
        }
    },
    uncomplete: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            await taskModel.uncomplete(id);
            res.redirect("/tasks");
        } catch (err) {
            error.c500(req, res, err);
        }
    },
    delete: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            await taskModel.delete(id);
            res.redirect("/tasks");
        } catch (err) {
            error.c500(req, res, err);
        }
    },
}

export default taskController;
