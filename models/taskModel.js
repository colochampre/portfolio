import db from "../config/db.js";

const taskModel = {
    getAll: async () => {
        try {
            const [results] = await db.query("SELECT * FROM tasks");
            return results;
        } catch (error) {
            throw { status: 500, message: "Error al obtener las tareas" };
        }
    },
    getTask: async (id) => {
        try {
            const [results] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
            return results[0];
        } catch (err) {
            throw { status: 500, message: `Error al obtener la tarea con id ${id}` };
        }
    },
    create: async (name) => {
        try {
            const [results] = await db.query("INSERT INTO tasks (name) VALUES (?)", [name]);
            return results;
        } catch (error) {
            throw { status: 500, message: "Error al crear tarea" };
        }
    },
    update: async (id, name) => {
        try {
            const [results] = await db.query("UPDATE tasks SET name = ? WHERE id = ?", [name, id]);
            return results;
        } catch (error) {
            throw { status: 500, message: `Error al actualizar la tarea con id ${id}` };
        }
    },
    complete: async (id) => {
        try {
            await db.query("UPDATE tasks SET completed = ? WHERE id = ?", [true, id]);
        } catch (err) {
            throw {
                status: 500,
                message: `Error al completar la tarea con el id ${id}`,
            };
        }
    },
    uncomplete: async (id) => {
        try {
            await db.query("UPDATE tasks SET completed = ? WHERE id = ?", [
                false,
                id,
            ]);
        } catch (err) {
            throw {
                status: 500,
                message: `Error al completar la tarea con el id ${id}`,
            };
        }
    },
    delete: async (id) => {
        try {
            await db.query("DELETE FROM tasks WHERE id = ?", [id]);
        } catch (error) {
            throw { status: 500, message: `Error al eliminar la tarea con id ${id}` };
        }
    },
}

export default taskModel;
