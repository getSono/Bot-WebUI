// Bot WebUI JavaScript
class BotWebUI {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupInitialState();
    }

    init() {
        // DOM elements
        this.elements = {
            messageInput: document.getElementById('message-input'),
            sendButton: document.getElementById('send-button'),
            clearButton: document.getElementById('clear-button'),
            chatMessages: document.getElementById('chat-messages'),
            typingIndicator: document.getElementById('typing-indicator'),
            statusIndicator: document.getElementById('status-indicator'),
            statusText: document.getElementById('status-text'),
            welcomeTime: document.getElementById('welcome-time')
        };

        // State
        this.state = {
            isTyping: false,
            messageCount: 1, // Starting with welcome message
            connected: true
        };

        // Validate DOM elements
        this.validateElements();
    }

    validateElements() {
        const missingElements = [];
        for (const [key, element] of Object.entries(this.elements)) {
            if (!element) {
                missingElements.push(key);
            }
        }

        if (missingElements.length > 0) {
            console.error('Missing DOM elements:', missingElements);
            this.showError('Some interface elements are missing. Please refresh the page.');
        }
    }

    setupInitialState() {
        // Set welcome message time
        if (this.elements.welcomeTime) {
            this.elements.welcomeTime.textContent = this.formatTime(new Date());
        }

        // Focus on input
        if (this.elements.messageInput) {
            this.elements.messageInput.focus();
        }

        // Update status
        this.updateConnectionStatus(true);
    }

    setupEventListeners() {
        // Send button click
        if (this.elements.sendButton) {
            this.elements.sendButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSendMessage();
            });
        }

        // Input keypress (Enter to send)
        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });

            // Input validation and character limit
            this.elements.messageInput.addEventListener('input', (e) => {
                this.handleInputChange(e);
            });

            // Handle paste events
            this.elements.messageInput.addEventListener('paste', (e) => {
                setTimeout(() => this.handleInputChange(e), 0);
            });
        }

        // Clear button
        if (this.elements.clearButton) {
            this.elements.clearButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleClearChat();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle online/offline events
        window.addEventListener('online', () => this.updateConnectionStatus(true));
        window.addEventListener('offline', () => this.updateConnectionStatus(false));
    }

    handleInputChange(e) {
        const input = e.target;
        const value = input.value;
        const maxLength = parseInt(input.getAttribute('maxlength')) || 1000;

        // Update send button state
        this.updateSendButtonState(value.trim().length > 0);

        // Handle character limit
        if (value.length >= maxLength) {
            this.showTempMessage('Character limit reached', 'warning');
        }

        // Auto-resize input if needed (for future textarea upgrade)
        this.autoResizeInput(input);
    }

    handleSendMessage() {
        const message = this.elements.messageInput?.value.trim();
        
        if (!message || this.state.isTyping) {
            return;
        }

        // Validate message
        if (!this.validateMessage(message)) {
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.elements.messageInput.value = '';
        this.updateSendButtonState(false);
        
        // Simulate bot response
        this.simulateBotResponse(message);
    }

    validateMessage(message) {
        if (message.length === 0) {
            this.showTempMessage('Please enter a message', 'warning');
            return false;
        }

        if (message.length > 1000) {
            this.showTempMessage('Message is too long', 'warning');
            return false;
        }

        // Basic spam protection
        if (this.isSpamMessage(message)) {
            this.showTempMessage('Please wait before sending another message', 'warning');
            return false;
        }

        return true;
    }

    isSpamMessage(message) {
        // Simple spam detection - prevent same message in quick succession
        const now = Date.now();
        const lastMessage = this.getLastUserMessage();
        
        if (lastMessage && 
            lastMessage.text === message && 
            (now - lastMessage.timestamp) < 2000) {
            return true;
        }

        return false;
    }

    getLastUserMessage() {
        const messages = this.elements.chatMessages?.querySelectorAll('.user-message');
        if (!messages || messages.length === 0) return null;
        
        const lastMessage = messages[messages.length - 1];
        const text = lastMessage.querySelector('.message-content p')?.textContent;
        const timeStr = lastMessage.querySelector('.message-time')?.textContent;
        
        return {
            text,
            timestamp: this.parseTimeString(timeStr)
        };
    }

    parseTimeString(timeStr) {
        // Simple time parsing - in real app, use proper date parsing
        if (!timeStr) return 0;
        
        const now = new Date();
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        let hour24 = hours;
        if (period === 'PM' && hours !== 12) hour24 += 12;
        if (period === 'AM' && hours === 12) hour24 = 0;
        
        const messageTime = new Date(now);
        messageTime.setHours(hour24, minutes, 0, 0);
        
        return messageTime.getTime();
    }

    addMessage(text, sender) {
        if (!this.elements.chatMessages) {
            console.error('Chat messages container not found');
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.setAttribute('role', 'article');
        messageDiv.setAttribute('aria-label', `${sender} message`);

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';
        avatar.setAttribute('aria-hidden', 'true');

        const content = document.createElement('div');
        content.className = 'message-content';

        const messageText = document.createElement('p');
        messageText.textContent = text;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(new Date());

        content.appendChild(messageText);
        content.appendChild(timeSpan);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.elements.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();

        // Update message count
        this.state.messageCount++;

        // Announce to screen readers
        this.announceMessage(text, sender);
    }

    simulateBotResponse(userMessage) {
        this.showTyping(true);

        // Simulate network delay
        const delay = Math.random() * 2000 + 1000; // 1-3 seconds

        setTimeout(() => {
            this.showTyping(false);
            const response = this.generateBotResponse(userMessage);
            this.addMessage(response, 'bot');
        }, delay);
    }

    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Simple response logic
        if (message.includes('hello') || message.includes('hi')) {
            return "Hello! Nice to meet you. How are you doing today?";
        }
        
        if (message.includes('help')) {
            return "I'm here to help! You can ask me questions, have a conversation, or just say hello. What would you like to know?";
        }
        
        if (message.includes('time')) {
            return `The current time is ${this.formatTime(new Date())}.`;
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
    }

    showTyping(show) {
        if (!this.elements.typingIndicator) return;

        this.state.isTyping = show;
        
        if (show) {
            this.elements.typingIndicator.classList.add('show');
            this.updateSendButtonState(false);
        } else {
            this.elements.typingIndicator.classList.remove('show');
            this.updateSendButtonState(this.elements.messageInput?.value.trim().length > 0);
        }
    }

    updateSendButtonState(enabled) {
        if (!this.elements.sendButton) return;

        this.elements.sendButton.disabled = !enabled || this.state.isTyping;
    }

    scrollToBottom() {
        if (!this.elements.chatMessages) return;

        // Use smooth scrolling if supported
        if ('scrollBehavior' in document.documentElement.style) {
            this.elements.chatMessages.scrollTo({
                top: this.elements.chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        }
    }

    handleClearChat() {
        if (!confirm('Are you sure you want to clear the chat history?')) {
            return;
        }

        if (!this.elements.chatMessages) return;

        // Remove all messages except welcome
        const messages = this.elements.chatMessages.querySelectorAll('.message');
        messages.forEach((message, index) => {
            if (index > 0) { // Keep welcome message (index 0)
                message.remove();
            }
        });

        // Reset state
        this.state.messageCount = 1;

        // Focus input
        if (this.elements.messageInput) {
            this.elements.messageInput.focus();
        }

        // Show confirmation
        this.showTempMessage('Chat cleared', 'success');
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (this.elements.messageInput) {
                this.elements.messageInput.focus();
            }
        }

        // Escape to blur input
        if (e.key === 'Escape') {
            if (document.activeElement === this.elements.messageInput) {
                this.elements.messageInput.blur();
            }
        }
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Re-focus input when tab becomes visible
            if (this.elements.messageInput && !this.state.isTyping) {
                setTimeout(() => {
                    this.elements.messageInput.focus();
                }, 100);
            }
        }
    }

    updateConnectionStatus(connected) {
        this.state.connected = connected;
        
        if (this.elements.statusIndicator && this.elements.statusText) {
            if (connected) {
                this.elements.statusIndicator.style.backgroundColor = 'var(--success-color)';
                this.elements.statusText.textContent = 'Connected';
            } else {
                this.elements.statusIndicator.style.backgroundColor = 'var(--danger-color)';
                this.elements.statusText.textContent = 'Offline';
            }
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    autoResizeInput(input) {
        // Future enhancement for textarea
        if (input.tagName.toLowerCase() === 'textarea') {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        }
    }

    showTempMessage(message, type = 'info') {
        // Create temporary message element
        const tempDiv = document.createElement('div');
        tempDiv.className = `temp-message temp-message--${type}`;
        tempDiv.textContent = message;
        tempDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            background: var(--surface);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            color: var(--text-primary);
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: var(--shadow-lg);
        `;

        // Add type-specific styling
        if (type === 'warning') {
            tempDiv.style.borderColor = 'var(--warning-color)';
            tempDiv.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        } else if (type === 'success') {
            tempDiv.style.borderColor = 'var(--success-color)';
            tempDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        }

        document.body.appendChild(tempDiv);

        // Remove after delay
        setTimeout(() => {
            if (tempDiv.parentNode) {
                tempDiv.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (tempDiv.parentNode) {
                        tempDiv.parentNode.removeChild(tempDiv);
                    }
                }, 300);
            }
        }, 3000);
    }

    announceMessage(text, sender) {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        announcement.textContent = `${sender === 'user' ? 'You' : 'Bot'} said: ${text}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    showError(message) {
        console.error('BotWebUI Error:', message);
        this.showTempMessage(message, 'warning');
    }

    // Public API methods
    sendMessage(text) {
        if (this.elements.messageInput) {
            this.elements.messageInput.value = text;
            this.handleSendMessage();
        }
    }

    clearChat() {
        this.handleClearChat();
    }

    getMessageHistory() {
        const messages = [];
        const messageElements = this.elements.chatMessages?.querySelectorAll('.message');
        
        if (messageElements) {
            messageElements.forEach(el => {
                const isUser = el.classList.contains('user-message');
                const text = el.querySelector('.message-content p')?.textContent;
                const time = el.querySelector('.message-time')?.textContent;
                
                if (text) {
                    messages.push({
                        sender: isUser ? 'user' : 'bot',
                        text,
                        time
                    });
                }
            });
        }
        
        return messages;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.botWebUI = new BotWebUI();
    } catch (error) {
        console.error('Failed to initialize BotWebUI:', error);
        
        // Fallback error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 8px;
            color: #c00;
            text-align: center;
            z-index: 9999;
        `;
        errorDiv.innerHTML = `
            <h3>Initialization Error</h3>
            <p>The chat interface failed to load properly.</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px;">Reload Page</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BotWebUI;
}