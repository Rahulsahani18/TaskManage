// src/components/TaskList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isAdmin, setIsAdmin] = useState();
    const [currentUserId, setCurrentUserId] = useState();
    const navigate = useNavigate();
    const token = getToken();
   
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data.tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        const fetchUser = async () => {
            const response = await axios.get('http://localhost:5000/api/tasks/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsAdmin(response.data.isAdmin);
            setCurrentUserId(response.data._id); // Assuming response contains the user's ID
            
        };

        fetchTasks();
        fetchUser();
    }, []);

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const updateTask = async (task) => {
        navigate('/task/new', { state: { task } });
    };

    const handleStatusChange = async (task_id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task_id}`, 
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
            setTasks((prevTasks) => 
                prevTasks.map((task) =>
                    task._id === task_id ? { ...task, status: newStatus } : task
                )
            );
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const renderButton = (task) => {
        // Assuming task.createdBy has an _id property that contains the user ID
        const createdById = task.createdBy._id || task.createdBy.id; 
    
        if (createdById === currentUserId) {
            return (
                <>
                    <button className="btn btn-danger me-3" onClick={() => deleteTask(task._id)}>Delete</button>
                    <button className="btn btn-warning" onClick={() => updateTask(task)}>Update</button>
                </>
            );
        } else {
            return null; // No buttons to render for tasks not created by the user
        }
    };
    

    return (
        <>
        {
            isAdmin ? (
                <div className="container mt-4">
                    <h2>Task List</h2>
                    <button className="btn btn-primary mb-3" onClick={() => navigate('/task/new')}>Add New Task</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Actions</th>
                                <th>Status</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td className=''>
                                        {renderButton(task)}
                                    </td>
                                    <td className='' >
                                        <span className="badge badge-primary mr-2">{task.status}</span>
                                        <select
                                            style={{ transform: "translate(0,-1rem)" }}
                                            className="form-select"
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        >
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>{task.dueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="container mt-4">
                    <h2>Task List</h2>
                    <button className="btn btn-primary mb-3" onClick={() => navigate('/task/new')}>Add New Task</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Actions</th>
                                <th>Status</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>
                                        {renderButton(task)}
                                    </td>
                                    <td className='' >
                                        <span className="badge badge-primary mr-2">{task.status}</span>
                                        <select
                                            style={{ transform: "translate(0,-1rem)", }}
                                            className="form-select"
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        >
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>{task.dueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        </>
    );
};

export default TaskList;
