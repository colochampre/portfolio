let skills = [
    { id: 0, title: "JavaScript", icon: "/img/javascript.png", tags: ["Frontend", "Backend"], },
    { id: 1, title: "Node Js", icon: "/img/nodejs.png", tags: ["Backend"], },
    { id: 2, title: "MySQL", icon: "/img/mysql.png", tags: ["Database"], },
    { id: 3, title: "PHP", icon: "/img/php.png", tags: ["Backend"], },
    { id: 4, title: "Python", icon: "/img/python.png", tags: ["Backend"], },
    { id: 5, title: "Java", icon: "/img/java.png", tags: ["Backend"], },
    { id: 6, title: "Bootstrap", icon: "/img/bootstrap.png", tags: ["Frontend"], },
    { id: 7, title: "C", icon: "", tags: ["Backend"], },
    { id: 8, title: "C++", icon: "", tags: ["Backend"], },
];

const getAllSkills = (req, res) => { 
    res.render("index", { skills });
};
const getAddSkillForm = (req, res) => {
    res.render("add-skill", { title: "Agregar Skill" });
};

const addSkill = (req, res) => { 
    let { title, icon } = req.body;
    let id = skills.length;
    skills.push({ id, title, icon, tags: [] });
    res.redirect("/");
};

const getEditSkillForm = (req, res) => { 
    let id = parseInt(req.params.id);
    let skill = skills.find((skill) => skill.id === id);

    if (!skill) {
        return res.redirect("/");
    } else {
        res.render("edit-skill", { title: "Editar Skill", skill });
    }
};

const editSkill = (req, res) => {
    let id = parseInt(req.params.id);
    let skillIndex = skills.findIndex((skill) => skill.id === id);

    if (skillIndex === -1) {
        return res.redirect("/");
    } else {
        skills[skillIndex].title = req.body.title;
        skills[skillIndex].icon = req.body.icon;
        res.redirect("/");
    }
};

const deleteSkill = (req, res) => {
    let id = parseInt(req.params.id);
    skills = skills.filter((skill) => skill.id !== id);
    res.redirect("/");
};

export default {
    getAllSkills,
    getAddSkillForm,
    addSkill,
    getEditSkillForm,
    editSkill,
    deleteSkill,
};
