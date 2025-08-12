# AI Prompt Engineer

## Overview

AI Prompt Engineer is a web-based application that helps users transform simple English descriptions into well-structured AI prompts. The application provides an intuitive interface where users can input their basic requirements and receive professionally crafted prompts optimized for various AI models. It includes features like prompt history, customizable parameters (tone, audience, format, length), and different prompt templates for various use cases.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a client-side architecture built with vanilla JavaScript and Material Design Lite (MDL) for the UI framework. The main components include:

- **PromptApp Class**: Central application controller managing UI interactions and state
- **PromptEngine Class**: Core logic engine responsible for transforming user input into structured AI prompts
- **Material Design Lite**: Provides responsive design components and consistent UI patterns
- **Modular CSS**: Custom styles built on top of MDL using CSS custom properties for theming

### Component Structure
- **Single Page Application**: All functionality contained within index.html with dynamic content updates
- **Template-Based Prompt Generation**: Uses predefined templates for different prompt categories (general, writing, analysis)
- **Local Storage**: Client-side persistence for prompt history and user preferences
- **Event-Driven Architecture**: Uses DOM events and custom event handlers for user interactions

### Prompt Engineering System
The core PromptEngine implements a template-based approach with:
- **Structured Templates**: Different templates for various use cases (general, writing, analysis)
- **Role-Based Prompts**: Predefined expert roles to enhance prompt effectiveness
- **Parameter Customization**: Configurable tone, audience, format, and length parameters
- **Quality Guidelines**: Built-in best practices for prompt construction

### User Interface Design
- **Material Design Philosophy**: Clean, intuitive interface following Google's Material Design principles
- **Responsive Layout**: Mobile-first design that adapts to different screen sizes
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features
- **Accessibility**: Semantic HTML structure with proper ARIA labels and keyboard navigation

## External Dependencies

### Frontend Libraries
- **Material Design Lite (MDL) 1.3.0**: UI component library and CSS framework
- **Google Fonts**: Roboto font family for consistent typography
- **Material Icons**: Icon font for UI elements

### Browser APIs
- **Local Storage API**: For persisting prompt history and user preferences
- **Clipboard API**: For copy-to-clipboard functionality
- **DOM Events**: For user interaction handling

### Development Dependencies
- **CSS Custom Properties**: For theming and maintainable styles
- **ES6+ JavaScript**: Modern JavaScript features for application logic
- **No Build Process**: Direct browser execution without compilation or bundling

The application is designed to be self-contained and runs entirely in the browser without requiring backend services or databases. All data persistence is handled through browser local storage.