import React from 'react';
import './Message.css';

const Message = ({ message }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  return (
    <div 
      className={`message ${message.sender}-message`}
      role="article"
      aria-label={`${message.sender} message`}
    >
      <div className="message-avatar" aria-hidden="true">
        {message.sender === 'user' ? '👤' : '🤖'}
      </div>
      
      <div className="message-content">
        <p className="message-text">{message.text}</p>
        <span className="message-time">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default Message;