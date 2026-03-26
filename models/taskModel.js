import db from "../config/db.js";

const taskModel = {
    getAll: async () => {
        try {
            const result = await db.query("SELECT * FROM tasks");
            return result.rows;
        } catch (error) {
            throw { status: 500, message: "Error al obtener las tareas" };
        }
    },
    getTask: async (id) => {
        try {
            const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
            return result.rows[0];
        } catch (err) {
            throw { status: 500, message: `Error al obtener la tarea con id ${id}` };
        }
    },
    create: async (name) => {
        try {
            const result = await db.query("INSERT INTO tasks (name) VALUES ($1) RETURNING *", [name]);
            return result.rows[0];
        } catch (error) {
            throw { status: 500, message: "Error al crear tarea" };
        }
    },
    update: async (id, name) => {
        try {
            const result = await db.query("UPDATE tasks SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
            return result.rows[0];
        } catch (error) {
            throw { status: 500, message: `Error al actualizar la tarea con id ${id}` };
        }
    },
    complete: async (id) => {
        try {
            await db.query("UPDATE tasks SET completed = $1 WHERE id = $2", [true, id]);
        } catch (err) {
            throw {
                status: 500,
                message: `Error al completar la tarea con el id ${id}`,
            };
        }
    },
    uncomplete: async (id) => {
        try {
            await db.query("UPDATE tasks SET completed = $1 WHERE id = $2", [
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
            await db.query("DELETE FROM tasks WHERE id = $1", [id]);
        } catch (error) {
            throw { status: 500, message: `Error al eliminar la tarea con id ${id}` };
        }
    },
}

export default taskModel;
