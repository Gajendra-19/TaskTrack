const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      userId
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get a single task
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to access this task"
      });
    }

    res.status(200).json({
      message: "Task retrieved successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to update this task"
      });
    }

    task = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to delete this task"
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
