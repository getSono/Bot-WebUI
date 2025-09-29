import React from 'react';
import './Header.css';

const Header = ({ isConnected }) => {
  return (
    <header className="header">
      <h1 className="header-title">🤖 Bot WebUI</h1>
      <div className="header-status">
        <span 
          className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}
          aria-hidden="true"
        />
        <span className="status-text">
          {isConnected ? 'Connected' : 'Offline'}
        </span>
      </div>
    </header>
  );
};

export default Header;