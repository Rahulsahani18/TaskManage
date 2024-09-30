const Task = require('../models/Task');
const User = require('../models/User')

// Create task
exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignedUser } = req.body;

  try {
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      createdBy: req.user.userId,
      assignedUser,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get tasks (with pagination, filtering)
// exports.getTasks = async (req, res) => {
//   const { page = 1, limit = 10, status, priority, assignedUser } = req.query;
//   const filter = { createdBy: req.user.userId };

//   if (status) filter.status = status;
//   if (priority) filter.priority = priority;
//   if (assignedUser) filter.assignedUser = assignedUser;

//   try {
//     const tasks = await Task.find(filter)
//       .populate('assignedUser')
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const totalTasks = await Task.countDocuments(filter);

//     res.json({
//       tasks,
//       totalPages: Math.ceil(totalTasks / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getAllTasks = async (req, res) => {
  try {
    let tasks;
    
    // Check if the user is an admin
    if (req.user.isAdmin) {
      // Admin: Get all tasks
      tasks = await Task.find().populate('assignedUser createdBy', 'name email'); // Populate assignedUser and createdBy with name and email fields
    } else {
      // Non-admin: Get only tasks created by or assigned to the user
      tasks = await Task.find({
        $or: [
          { createdBy: req.user.userId },
          { assignedUser: req.user.userId }
        ]
      }).populate('assignedUser createdBy', 'name email');
    }

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res)=>{
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Ensure to exclude the password
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
}
}

// Assign task (Admin only)
exports.assignTask = async (req, res) => {
  const { taskId, assignedUser } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { assignedUser }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, priority, status, dueDate } = req.body;
  
    try {
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      // Ensure the user is the owner or admin
      // if (task.createdBy.toString() !== req.user.userId && !req.user.isAdmin) {
      //   return res.status(403).json({ message: 'Unauthorized' });
      // }
  
      task.title = title || task.title;
      task.description = description || task.description;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
  
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete task
  exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;
  
    try {
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      // Ensure the user is the owner or admin
      if (task.createdBy.toString() !== req.user.userId && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      await Task.findByIdAndDelete(taskId);
      res.json({ message: 'Task removed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  