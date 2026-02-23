let skills = [
    { id: 0, title: "JavaScript", icon: "/img/javascript.png" },
    { id: 1, title: "Node Js", icon: "/img/nodejs.png" },
    { id: 2, title: "MySQL", icon: "/img/mysql.png" },
    { id: 3, title: "PHP", icon: "/img/php.png" },
    { id: 4, title: "Python", icon: "/img/python.png" },
    { id: 5, title: "Java", icon: "/img/java.png" },
    { id: 6, title: "Bootstrap", icon: "/img/bootstrap.png" },
    { id: 7, title: "C", icon: "" },
    { id: 8, title: "C++", icon: "" },
];

const taskController = {


    getAll: (req, res) => {
        res.render("index", { skills });
    },

    getAddForm: (req, res) => {
        res.render("add-skill", { title: "Agregar Skill" });
    },

    addl: (req, res) => {
        let { title, icon } = req.body;
        let id = skills.length;
        skills.push({ id, title, icon });
        res.redirect("/");
    },

    getEditForm: (req, res) => {
        let id = parseInt(req.params.id);
        let skill = skills.find((skill) => skill.id === id);

        if (!skill) {
            return res.redirect("/");
        } else {
            res.render("edit-skill", { title: "Editar Skill", skill });
        }
    },

    edit: (req, res) => {
        let id = parseInt(req.params.id);
        let skillIndex = skills.findIndex((skill) => skill.id === id);

        if (skillIndex === -1) {
            return res.redirect("/");
        } else {
            skills[skillIndex].title = req.body.title;
            skills[skillIndex].icon = req.body.icon;
            res.redirect("/");
        }
    },

    delete: (req, res) => {
        let id = parseInt(req.params.id);
        skills = skills.filter((skill) => skill.id !== id);
        res.redirect("/");
    },
}

export default taskController;
