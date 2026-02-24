import exampleModel from "../models/exampleModel.js";
import error from "../middlewares/error.js";

const exampleController = {
    getAll: async (req, res) => {
        try {
            let skills = await exampleModel.getAll();
            res.render("index", { skills });
        } catch (err) {
            error.c500(req, res, err);
        }
    },

    getAddForm: (req, res) => {
        res.render("skill-add", { title: "Agregar Skill" });
    },

    getEditForm: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            let skill = await exampleModel.getSkill(id);

            if (!skill) {
                error.c404(req, res);
            } else {
                res.render("skill-edit", { title: "Editar Skill", skill });
            }
        } catch (err) {
            error.c500(req, res, err);
        }
    },

    create: async (req, res) => {
        try {
            let { title, icon } = req.body;
            await exampleModel.create(title, icon);
            res.redirect("/");
        } catch (err) {
            error.c500(req, res, err);
        }
    },

    update: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            let title = req.body.title;
            let icon = req.body.icon;
            await exampleModel.update(id, title, icon);
            res.redirect("/");
        } catch (err) {
            error.c500(req, res, err);
        }
    },

    delete: async (req, res) => {
        try {
            let id = parseInt(req.params.id);
            await exampleModel.delete(id);
            res.redirect("/");
        } catch (err) {
            error.c500(req, res, err);
        }
    },
}

export default exampleController;
