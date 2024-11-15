
import { createTask, getTasks, getTaskById, deleteTask, updateTask } from "../controllers/task.js";
import express from 'express';
const router = express.Router();

router.post('/create', createTask);

router.get('/', getTasks);

router.get('/:id', getTaskById);

router.put('/update/:id', updateTask);

router.delete('/delete/:id', deleteTask);

export default router;