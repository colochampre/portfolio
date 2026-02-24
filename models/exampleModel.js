import db from "../config/db.js";

const exampleModel = {
    getAll: async () => {
        try {
            const [results] = await db.query("SELECT * FROM skills");
            return results;
        } catch (error) {
            throw { status: 500, message: "Error al obtener las skills" };
        }
    },
    getSkill: async (id) => {
        try {
            const [results] = await db.query("SELECT * FROM skills WHERE id = ?", [id]);
            return results[0];
        } catch (err) {
            throw { status: 500, message: `Error al obtener el skill con id ${id}` };
        }
    },
    create: async (title, icon) => {
        try {
            const [results] = await db.query("INSERT INTO skills (title, icon) VALUES (?, ?)", [title, icon]);
            return results;
        } catch (error) {
            throw { status: 500, message: "Error al crear skill" };
        }
    },
    update: async (id, title, icon) => {
        try {
            const [results] = await db.query("UPDATE skills SET title = ?, icon = ? WHERE id = ?", [title, icon, id]);
            return results;
        } catch (error) {
            throw { status: 500, message: `Error al actualizar el skill con id ${id}` };
        }
    },
    delete: async (id) => {
        try {
            await db.query("DELETE FROM skills WHERE id = ?", [id]);
        } catch (error) {
            throw { status: 500, message: `Error al eliminar el skill con id ${id}` };
        }
    },
}

export default exampleModel;
