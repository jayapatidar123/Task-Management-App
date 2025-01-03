import React from 'react';
import Notifications from './Notifications'; 
import './Header.css'; 
import MenuIcon from '@mui/icons-material/Menu'; 
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon

const Header = ({ isLoggedIn, onLogout, tasks, toggleMenu, username }) => { 
  return (
    <header className="header">
      <div className="header-container"> 
        {isLoggedIn && (
          <>
            <button onClick={toggleMenu} className="menu-button">
              <MenuIcon /> 
            </button>
            <span className="welcome-message">Welcome, {username}</span> 
          </>
        )}
        <h1 className="logo">Task Manager</h1> 
        {isLoggedIn && (
          <div className="header-actions"> 
            <Notifications tasks={tasks} />
            <button onClick={onLogout} className="logout-button">
              <LogoutIcon /> {/* Use LogoutIcon here */}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>Developed by Yogita Beniwal (<a href="mailto:yogitabeniwal2004@gmail.com">yogitabeniwal2004@gmail.com</a>)</p>
      </div>
    </footer>
  );
};

export { Header, Footer };
