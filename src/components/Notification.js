import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div 
      className={`notification notification--${type}`}
      role="alert"
      aria-live="polite"
    >
      <span className="notification-message">{message}</span>
      <button 
        className="notification-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;