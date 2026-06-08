import React from 'react';
import './Navbar.css';
import icon_img from "../assets/icon_img.png";

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-content">
        <img src={icon_img} alt="TaskTrack Logo" class="icon"/>
        <h1 className="dashboard-name">Task Manager</h1>
        <div className="dashboard-user-section">
          <span className="dashboard-user-name">Welcome, {user?.name}!</span>
          <button onClick={onLogout} className="dashboard-logout-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
