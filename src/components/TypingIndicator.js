import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = () => {
  return (
    <div className="message bot-message typing-message">
      <div className="message-avatar" aria-hidden="true">
        🤖
      </div>
      
      <div className="message-content typing-content">
        <div className="typing-dots" aria-label="Bot is typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;