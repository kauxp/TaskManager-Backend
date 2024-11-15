import express from "express";
import { getAllUsers, deleteTaskByAdmin } from "../controllers/admin.js";

const router = express.Router();

router.get("/users",  getAllUsers);
router.delete("/tasks/:id", deleteTaskByAdmin);

export default router;
