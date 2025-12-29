import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import './Navigation.css';

const Navigation = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return null; // Don't show navigation on login pages
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          Betting Specialist Demo
        </div>
        <div className="nav-right">
          <div className="user-info">
            <span className="user-role">{user.role === 'admin' ? '👤 Admin' : '👤 User'}</span>
            <span className="user-name">{user.username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

