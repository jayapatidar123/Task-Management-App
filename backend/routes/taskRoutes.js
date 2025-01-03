// backend/routes/taskRoutes.js
const express = require('express');
const { createTask, getTasks, deleteTask, updateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createTask).get(protect, getTasks);

router.route('/:id').delete(protect, deleteTask); // Add delete route

router.put('/:id', protect, updateTask); // Correctly apply protect middleware


module.exports = router;
