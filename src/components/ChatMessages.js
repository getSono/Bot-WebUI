import React, { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import './ChatMessages.css';

const ChatMessages = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  return (
    <div className="chat-messages" ref={containerRef}>
      <div className="messages-container">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;