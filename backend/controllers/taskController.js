// backend/controllers/taskController.js
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    const { title, description, dueDate, status } = req.body;
    try {
        const task = await Task.create({ title, description, dueDate, status, user: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Task creation failed', error });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Fetching tasks failed', error });
    }
};

exports.deleteTask = async (req, res) => {
    try {
      const taskId = req.params.id; 
      const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: req.user.id });
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }
  
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Deleting task failed', error });
    }
  };
  exports.updateTask = async (req, res) => {
    try {
      const taskId = req.params.id;
      const updates = req.body; // Get update data from request body
      //console.log("Received task ID for update:", taskId);
      // Find the task by ID and ensure it belongs to the logged-in user
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: req.user.id }, 
        updates, 
        { new: true } // Return the updated document
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }
  
      res.json(updatedTask); // Send the updated task as a response
    } catch (error) {
      res.status(500).json({ message: 'Updating task failed', error });
    }
  };
