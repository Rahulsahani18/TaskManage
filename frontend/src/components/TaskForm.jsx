import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'
import { getToken } from '../services/authService';

const TaskForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignedUser, setAssignedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAdmin, setIsAdmin] = useState();
    const token = getToken();

    useEffect(() => {
        const updateTask = () => {
            if (location.state && location.state.task) {
                const { task } = location.state;
                setTitle(task.title);
                setDescription(task.description);
                setDueDate(task.dueDate);
                setAssignedUser(task.assignedUser);
                setIsUpdating(true);
            }
        };

        const fetchUser = async () => {
            const response = await axios.get('http://localhost:5000/api/tasks/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsAdmin(response.data.isAdmin);
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/allUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        updateTask();
        fetchUser();
        fetchUsers();
    }, [token, location.state]);

    const handleNonAdminSubmit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${location.state.task._id}`, {
                title,
                description,
                dueDate,
                assignedUser,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Re-fetch tasks instead of navigating
            navigate('/tasks')
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isAdmin) {
                if (isUpdating && location.state.task) {
                    await axios.put(`http://localhost:5000/api/tasks/${location.state.task._id}`, {
                        title,
                        description,
                        dueDate,
                        assignedUser,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    await axios.post('http://localhost:5000/api/tasks', {
                        title,
                        description,
                        dueDate,
                        assignedUser,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
            } else {
                handleNonAdminSubmit()
            }

            // Re-fetch tasks after form submission
            navigate('/tasks')
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>{isUpdating ? 'Update Task' : 'Create New Task'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Due Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                {isAdmin && (
                    <div className="form-group">
                        <label htmlFor="assignedUser">Assign Task To</label>
                        <select
                            className="form-control"
                            id="assignedUser"
                            value={assignedUser}
                            onChange={(e) => setAssignedUser(e.target.value)}
                            required
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button type="submit" className="btn btn-primary mt-3">
                    {isUpdating ? 'Update Task' : 'Create Task'}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
