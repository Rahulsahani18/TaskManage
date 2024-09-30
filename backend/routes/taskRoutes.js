const express = require('express');
const { auth, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

const {
    createTask,
    updateTask,
    deleteTask,
    getAllTasks,
    assignTask,
    getMe
  } = require('../controllers/taskController');  // Adjust path as necessary

// Create task
router.post('/', auth, createTask);

// Get tasks (pagination & filtering)
router.get('/', auth, getAllTasks);
router.get('/me', auth, getMe);
// Update task
router.put('/:taskId', auth, updateTask);

// Delete task
router.delete('/:taskId', auth, deleteTask);


// Assign task (admin only)
router.post('/assign', auth, isAdmin, assignTask);

module.exports = router;
