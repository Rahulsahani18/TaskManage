import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskReport = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', assignedUser: '' });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('/api/report', { params: filters });
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to generate report', error);
      }
    };
    fetchReport();
  }, [filters]);

  const downloadCSV = async () => {
    try {
      const response = await axios.get('/api/report', {
        params: { ...filters, format: 'csv' },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'task-report.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Failed to download CSV', error);
    }
  };

  return (
    <div>
      <h2>Task Report</h2>
      <div>
        <label>Status: </label>
        <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <label>Priority: </label>
        <select onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <button onClick={downloadCSV}>Download CSV</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Assigned to: {task.assignedUser?.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskReport;
