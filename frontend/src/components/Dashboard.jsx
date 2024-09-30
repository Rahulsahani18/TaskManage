import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/api/tasks/me', {
          headers: { Authorization: `Bearer ${token}` },

        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  if (!userInfo) return <div>Loading...</div>;

  return (
    <>
    <div className="container mt-5 text-center">
      <h2 style={{color:"blue"}}>Welcome, {userInfo.username}</h2>
      <p style={{color:"red"}}>Email: {userInfo.email}</p>
    </div>
    <div className='row'>
 <div className='col-md-12 mt-5 text-center d-flex justify-content-center'>
  <div className=' '>
   < Link  to="/tasks"><button className='btn btn-success '>Click here to show tasks</button></Link>
  </div>
 </div>
    </div>
    </>
  );
};

export default Dashboard;
