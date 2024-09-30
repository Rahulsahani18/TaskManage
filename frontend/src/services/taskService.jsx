import axios from 'axios';

const API_URL = '/api/tasks/';

const getTasks = async (queryParams) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: queryParams,
  });
  return response.data;
};

const createTask = async (taskData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateTask = async (taskId, taskData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}${taskId}`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteTask = async (taskId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const taskService = { getTasks, createTask, updateTask, deleteTask };
export default taskService;
