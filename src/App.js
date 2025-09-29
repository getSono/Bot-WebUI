import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import Footer from './components/Footer';
import Notification from './components/Notification';
import { useBotResponses } from './hooks/useBotResponses';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your friendly bot assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const messageIdRef = useRef(2);
  const inputRef = useRef(null);
  
  const { generateBotResponse } = useBotResponses();
  
  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);
  
  const addMessage = useCallback((text, sender) => {
    const newMessage = {
      id: messageIdRef.current++,
      text,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const validateMessage = useCallback((message) => {
    if (message.length === 0) {
      showNotification('Please enter a message', 'warning');
      return false;
    }
    
    if (message.length > 1000) {
      showNotification('Message is too long', 'warning');
      return false;
    }
    
    return true;
  }, [showNotification]);
  
  const handleSendMessage = useCallback(async (message) => {
    if (!validateMessage(message) || isTyping) {
      return false;
    }
    
    // Add user message
    addMessage(message, 'user');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Simulate network delay
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Generate and add bot response
      const response = generateBotResponse(message);
      addMessage(response, 'bot');
      
    } catch (error) {
      console.error('Error generating bot response:', error);
      addMessage("I'm sorry, I encountered an error. Please try again.", 'bot');
      showNotification('Error generating response', 'warning');
    } finally {
      setIsTyping(false);
    }
    
    return true;
  }, [validateMessage, isTyping, addMessage, generateBotResponse, showNotification]);
  
  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([messages[0]]); // Keep welcome message
      messageIdRef.current = 2;
      showNotification('Chat cleared', 'success');
      
      // Focus input after clearing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [messages, showNotification]);
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    'escape': () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  });
  
  return (
    <div className="app">
      <div className="app-container">
        <Header isConnected={isConnected} />
        
        <main className="app-main">
          <ChatMessages 
            messages={messages} 
            isTyping={isTyping}
          />
          
          <ChatInput
            ref={inputRef}
            onSendMessage={handleSendMessage}
            onClear={handleClearChat}
            disabled={isTyping}
          />
        </main>
        
        <Footer />
      </div>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default App;