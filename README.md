# AI Prompt Engineer

A sophisticated web application that transforms simple English descriptions into professional, well-structured AI prompts using advanced prompt engineering techniques.

## Features

🎯 **Smart Prompt Generation** - Converts basic task descriptions into enterprise-level AI prompts
🎨 **Material Design Interface** - Clean, intuitive UI following Google's Material Design principles
🔧 **Multiple Prompt Types** - Specialized templates for different use cases:
- General tasks
- Writing & content creation
- Data analysis & research
- Creative projects
- Programming & technical tasks
- Research & investigation

⚙️ **Advanced Customization**
- Tone adjustment (professional, casual, authoritative, etc.)
- Audience targeting
- Output format specification
- Length control

📊 **Professional Features**
- Prompt history with local storage
- Copy-to-clipboard functionality
- Quality validation checkpoints
- Success metrics and evaluation criteria
- Advanced prompting techniques (chain-of-thought, few-shot learning, etc.)

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Material Design Lite (MDL) 1.3.0
- **Fonts**: Google Fonts (Roboto family)
- **Icons**: Material Icons
- **Storage**: Browser Local Storage API

## Getting Started

### Prerequisites

- Modern web browser with JavaScript enabled
- No server-side dependencies required

### Installation

1. Clone or download the project files
2. Open `index.html` in a web browser, or
3. Serve the files using a simple HTTP server:

```bash
# Using Python 3
python -m http.server 5000

# Using Node.js (if you have live-server installed)
live-server --port=5000

# Using PHP
php -S localhost:5000
```

4. Navigate to `http://localhost:5000` in your browser

## Usage

### Basic Usage

1. **Select Prompt Type**: Choose the category that best matches your task
2. **Describe Your Task**: Enter a simple description of what you want to accomplish
3. **Customize Options** (optional): Set tone, audience, format, and length preferences
4. **Generate Prompt**: Click the "Generate Prompt" button
5. **Copy & Use**: Copy the generated prompt and use it with your preferred AI model

### Example

**Input**: "Write a blog post about sustainable living"

**Generated Output**: A comprehensive, professional AI prompt with:
- Expert role definition
- Clear objectives and success criteria
- Detailed methodology
- Specific instructions and constraints
- Output format requirements
- Quality standards
- Validation checkpoints

### Advanced Features

- **History Management**: Save and reuse previous prompts
- **Regeneration**: Create variations of existing prompts
- **Quality Metrics**: Built-in evaluation criteria
- **Professional Templates**: Industry-standard prompt structures

## Prompt Engineering Methodology

The application uses advanced prompt engineering techniques:

- **Role-Based Prompting**: Establishes expert authority and domain knowledge
- **Chain-of-Thought**: Encourages step-by-step reasoning
- **Few-Shot Learning**: Provides examples for better understanding
- **Constraint-Based**: Works within specific limitations and requirements
- **Structured Thinking**: Breaks down complex problems systematically

## Project Structure

```
ai-prompt-engineer/
├── index.html              # Main application file
├── css/
│   └── styles.css         # Custom styles and Material Design customizations
├── js/
│   ├── app.js            # Main application logic and UI interactions
│   └── prompt-engine.js  # Core prompt generation engine
├── favicon.ico           # Application favicon
└── README.md            # This file
```

## Browser Compatibility

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

This is a self-contained web application. To contribute:

1. Fork the repository
2. Make your changes
3. Test thoroughly across different browsers
4. Submit a pull request

## Features Roadmap

- [ ] Export prompts to various formats (PDF, Word, etc.)
- [ ] Integration with popular AI APIs
- [ ] Collaborative prompt sharing
- [ ] Advanced analytics and prompt performance tracking
- [ ] Custom template creation
- [ ] Multi-language support

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the browser console for JavaScript errors
2. Ensure JavaScript is enabled
3. Try refreshing the page or clearing browser cache
4. Use a modern browser that supports ES6+ features

## Acknowledgments

- Built with Material Design Lite by Google
- Inspired by modern prompt engineering best practices
- Uses Google Fonts and Material Icons

---

**Version**: 2.0  
**Last Updated**: August 2025  
**Compatibility**: Modern browsers with ES6+ support