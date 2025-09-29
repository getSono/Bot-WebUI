import { useCallback } from 'react';

export const useBotResponses = () => {
  const generateBotResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Simple response logic
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! Nice to meet you. How are you doing today?";
    }
    
    if (message.includes('help')) {
      return "I'm here to help! You can ask me questions, have a conversation, or just say hello. What would you like to know?";
    }
    
    if (message.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}.`;
    }
    
    if (message.includes('weather')) {
      return "I don't have access to weather data, but I hope it's nice where you are! 🌤️";
    }
    
    if (message.includes('clear') || message.includes('reset')) {
      return "You can clear the chat using the Clear button below the input field.";
    }

    if (message.includes('thank')) {
      return "You're welcome! I'm happy I could help. Is there anything else you'd like to know?";
    }

    if (message.includes('bye') || message.includes('goodbye')) {
      return "Goodbye! It was nice chatting with you. Feel free to come back anytime! 👋";
    }

    if (message.includes('react')) {
      return "Yes! I'm built with React! It's a great library for building user interfaces. Do you enjoy working with React?";
    }
    
    // Default responses
    const responses = [
      "That's interesting! Could you tell me more about that?",
      "I see what you mean. What made you think about that?",
      "That's a great point! How do you feel about it?",
      "Thanks for sharing that with me. What else is on your mind?",
      "I appreciate you telling me that. Is there anything specific you'd like to discuss?",
      "That sounds important to you. Would you like to elaborate?",
      "I'm listening! What would you like to talk about next?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }, []);
  
  return { generateBotResponse };
};