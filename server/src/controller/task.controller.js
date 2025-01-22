import pool from "../config/task.config.js";

const fetchTaskById = async (id) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM tasks WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return null; // Task not found
    }
    return rows[0];
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error.message);
    throw error;
  }
};

export const addTask = async (req, res) => {
  const { task, description } = req.body;

  if (!task || !description) {
    return res.status(400).json({ error: "Task and description are required" });
  }

  try {
    const [response] = await pool.execute(
      `INSERT INTO tasks (task, description) VALUES (?, ?)`,
      [task, description]
    );
    const id = response.insertId;

    const newTask = await fetchTaskById(id);
    return res.status(201).json({
      message: "Task added successfully",
      data: newTask,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const [response] = await pool.execute(`SELECT * FROM tasks`);

    if (response.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      total: response.length,
      tasks: response,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getTaskById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }
  
  try {
    const response = await fetchTaskById(id);

    if (!response) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({
      message: "Task retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  const id = parseInt(req.params.id);
  let { task, description, completed, status } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  if (typeof completed === "string") {
    completed = completed.toLowerCase() === "true" ? 1 : 0;
  }

  if (typeof status === "string") {
    status = status.toLowerCase() === "true" ? 1 : 0;
  }

  if (
    !task &&
    !description &&
    completed === undefined &&
    status === undefined
  ) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update" });
  }

  const updateFields = [];
  const values = [];

  if (task) {
    updateFields.push("task = ?");
    values.push(task);
  }

  if (description) {
    updateFields.push("description = ?");
    values.push(description);
  }

  if (typeof status === "boolean") {
    updateFields.push("status = ?");
    values.push(status);
  }

  if (typeof completed === "boolean") {
    updateFields.push("completed = ?");
    values.push(completed);
  }

  updateFields.push("updatedAt = CURRENT_TIMESTAMP");
  values.push(id);

  console.log(updateFields, values);
  try {
    const [response] = await pool.execute(
      `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    if (response.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Retrieve the updated task
    const updatedTask = await fetchTaskById(id);

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  try {
    const [response] = await pool.execute(`DELETE FROM tasks WHERE id = ?`, [
      id,
    ]);

    if (response.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error" });
  }
};
