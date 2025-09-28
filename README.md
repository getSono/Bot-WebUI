# Bot-WebUI

A modern, responsive web-based chat interface for bots built with vanilla HTML, CSS, and JavaScript.

## Features

- 🎨 **Modern Design**: Clean, responsive UI with dark/light mode support
- 💬 **Real-time Chat**: Simulated bot responses with typing indicators
- ♿ **Accessible**: WCAG compliant with screen reader support
- 📱 **Mobile-Friendly**: Fully responsive design for all devices
- ⚡ **Fast Loading**: No frameworks, pure vanilla JavaScript
- 🎯 **Cross-Browser**: Compatible with all modern browsers
- 🛡️ **Error Handling**: Robust error handling and input validation

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/getSono/Bot-WebUI.git
   cd Bot-WebUI
   ```

2. Open `index.html` in your browser or serve it using a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (if you have it)
   npx serve .
   ```

3. Navigate to `http://localhost:8000` in your browser.

## Project Structure

```
Bot-WebUI/
├── index.html      # Main HTML file
├── styles.css      # CSS styles with responsive design
├── script.js       # JavaScript functionality
├── package.json    # Project configuration
├── README.md       # This file
└── LICENSE         # GPL-3.0 license
```

## Customization

### Styling
Modify `styles.css` to customize the appearance. The CSS uses CSS custom properties (variables) for easy theming:

```css
:root {
    --primary-color: #6366f1;
    --background: #ffffff;
    --text-primary: #111827;
    /* ... more variables */
}
```

### Bot Logic
Update the `generateBotResponse()` function in `script.js` to customize bot responses or integrate with a real bot API.

### Features
The JavaScript class `BotWebUI` provides methods to:
- Send messages programmatically
- Clear chat history
- Get message history
- Handle keyboard shortcuts

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.