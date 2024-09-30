import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {email,password});
      login(response.data.token);  // Save token
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('Email not exists. Please use a different email.');
    } else {
        console.error('Registration failed:', error);
        alert('Login failed. Please try again later.');
    }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) =>setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) =>setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            <Link className='ms-5' to='/'> I have not account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
