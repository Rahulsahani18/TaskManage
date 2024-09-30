const Task = require('../models/Task');
const { Parser } = require('json2csv');

// Generate task report
exports.getTaskReport = async (req, res) => {
  const { format = 'json', status, priority, assignedUser } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedUser) filter.assignedUser = assignedUser;

  try {
    const tasks = await Task.find(filter)
      .populate('createdBy', 'username')
      .populate('assignedUser', 'username');

    if (format === 'csv') {
      const fields = ['title', 'description', 'status', 'priority', 'dueDate', 'createdBy.username', 'assignedUser.username'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(tasks);
      res.header('Content-Type', 'text/csv');
      res.attachment('task-report.csv');
      return res.send(csv);
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
