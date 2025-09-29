# Bot-WebUI

A modern, responsive React-based web interface for bots with real-time chat functionality.

## Features

- ⚛️ **Built with React**: Modern React 18 with hooks and functional components
- 🎨 **Modern Design**: Clean, responsive UI with dark/light mode support
- 💬 **Real-time Chat**: Simulated bot responses with typing indicators
- ♿ **Accessible**: WCAG compliant with screen reader support
- 📱 **Mobile-Friendly**: Fully responsive design for all devices
- ⚡ **Fast Performance**: Optimized React components with proper state management
- 🎯 **Cross-Browser**: Compatible with all modern browsers
- 🛡️ **Robust**: Error handling, input validation, and spam protection

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/getSono/Bot-WebUI.git
   cd Bot-WebUI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`

Launches the test runner in interactive watch mode.

## Project Structure

```
Bot-WebUI/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── Header.js       # App header with status
│   │   ├── ChatMessages.js # Message container
│   │   ├── Message.js      # Individual message component
│   │   ├── TypingIndicator.js # Bot typing animation
│   │   ├── ChatInput.js    # Input form component
│   │   ├── Footer.js       # App footer
│   │   └── Notification.js # Toast notifications
│   ├── hooks/              # Custom React hooks
│   │   ├── useBotResponses.js    # Bot response logic
│   │   └── useKeyboardShortcuts.js # Keyboard shortcuts
│   ├── App.js             # Main app component
│   ├── App.css            # App-specific styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies
└── README.md             # This file
```

## Component Architecture

### Main Components

- **App**: Root component managing global state (messages, typing, notifications)
- **Header**: Displays title and connection status
- **ChatMessages**: Container for all messages with auto-scroll
- **Message**: Individual message bubble with avatar and timestamp
- **TypingIndicator**: Animated typing dots when bot is responding
- **ChatInput**: Input form with send button and character counter
- **Footer**: Simple footer with copyright info
- **Notification**: Toast notifications for user feedback

### Custom Hooks

- **useBotResponses**: Generates intelligent bot responses based on user input
- **useKeyboardShortcuts**: Handles keyboard navigation and shortcuts

## Customization

### Styling
The app uses CSS custom properties for easy theming. Modify the variables in `src/index.css`:

```css
:root {
  --primary-color: #6366f1;
  --background: #ffffff;
  --text-primary: #111827;
  /* ... more variables */
}
```

### Bot Responses
Customize bot behavior by modifying the `generateBotResponse` function in `src/hooks/useBotResponses.js`.

### Adding Features
The modular component architecture makes it easy to add new features:
- Add new components in `src/components/`
- Create custom hooks in `src/hooks/`
- Extend the main state in `App.js`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## React Features Used

- **React 18**: Latest React features and improvements
- **Functional Components**: Modern React with hooks
- **Custom Hooks**: Reusable logic extraction
- **forwardRef**: Proper ref forwarding for input focus
- **useEffect/useState**: State and side effect management
- **useCallback**: Performance optimization for event handlers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.