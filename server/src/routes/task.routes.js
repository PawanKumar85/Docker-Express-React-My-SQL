import express from "express";
import { addTask, deleteTask, getAllTasks, getTaskById, updateTask } from "../controller/task.controller.js";
const router = express.Router();

// create a task
router.post("/tasks", addTask);

// Get all tasks
router.get("/tasks", getAllTasks);

// Get Task By Id
router.get("/tasks/:id", getTaskById);

// Update task
router.patch("/tasks/:id", updateTask);

// Delete task
router.delete("/tasks/:id", deleteTask);

export default router;
