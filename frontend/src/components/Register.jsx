

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate= useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user', // Default to user
        adminPassword: ''
    });

    const [isAdmin, setIsAdmin] = useState(false); // To track if admin is selected

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value

        });
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setIsAdmin(selectedRole === 'admin'); // Show admin password if "admin" is selected
        setFormData({
            ...formData,
            role: selectedRole
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            // If registration is successful, navigate to login
            if (response.status === 201) {
                navigate('/login');
            }
    
        } catch (error) {
            // Check if the error response status is 400 (Bad Request)
            if (error.response && error.response.status === 400) {
                alert('Email already exists. Please use a different email.');
            } else {
                console.error('Registration failed:', error);
                alert('Registration failed. Please try again later.');
            }
        }
    };
    

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        name="username"
                        id="name"
                        className="form-control"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role:</label>
                    <select
                        name="role"
                        id="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleRoleChange}
                    >
                        <option value="user">User/Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {isAdmin && (
                    <div className="mb-3">
                        <label htmlFor="adminPassword" className="form-label">Admin Password:</label>
                        <input
                            type="password"
                            name="adminPassword"
                            id="adminPassword"
                            className="form-control"
                            value={formData.adminPassword}
                            onChange={handleInputChange}
                        />
                    </div>
                )}

                <button type="submit" className="btn btn-primary">Register</button>
                <Link className='ms-5' to='/login'>Already I have account</Link>
            </form>
        </div>
    );
};

export default Register;
