import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import './Login.css';

const UserLogin = () => {
  const [username, setUsername] = useState('user@yopmail.com');
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
    dispatch(login({ username, password, role: 'user' }));
    navigate('/user');
  };

  return (
    <div className="login-container user-login">
      <div className="login-card">
        <div className="login-header">
          <h1>User Login</h1>
          <p>Access the betting platform</p>
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
              placeholder="Enter your username"
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

          <button type="submit" className="login-btn user-login-btn">
            Login as User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;

