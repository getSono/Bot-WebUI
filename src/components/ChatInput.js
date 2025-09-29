import React, { useState, forwardRef } from 'react';
import './ChatInput.css';

const ChatInput = forwardRef(({ onSendMessage, onClear, disabled }, ref) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isSending) return;
    
    setIsSending(true);
    const success = await onSendMessage(trimmedMessage);
    
    if (success) {
      setMessage('');
    }
    
    setIsSending(false);
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setMessage(value);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const isDisabled = disabled || isSending || !message.trim();
  
  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-group">
          <input
            ref={ref}
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            maxLength={1000}
            autoComplete="off"
          />
          
          <button 
            type="submit"
            className="send-button"
            disabled={isDisabled}
            title="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
      
      <div className="input-actions">
        <button
          type="button"
          className="action-button"
          onClick={onClear}
          title="Clear chat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path 
              d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Clear
        </button>
        
        <div className="character-count">
          {message.length}/1000
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;