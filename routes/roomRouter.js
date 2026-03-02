import express from "express";
import roomController from "../controllers/roomController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/room", auth.requireAuth, roomController.createRoom);
router.get("/room/:id", auth.requireAuth, roomController.getRoom);

export default router;
