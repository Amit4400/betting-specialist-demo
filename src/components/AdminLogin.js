import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import './Login.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('admin@yopmail.com');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // For demo, accept any credentials
    dispatch(login({ username, password, role: 'admin' }));
    navigate('/admin');
  };

  return (
    <div className="login-container admin-login">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Access the deposit management system</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn admin-login-btn">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

