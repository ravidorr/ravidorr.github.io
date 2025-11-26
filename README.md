# ravidorr.github.io

A simple website for tests hosted on GitHub Pages.

## Quick Start

### Installation

Install project dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm start
```

This will:
- Build static assets
- Start a local server at `http://localhost:3000`
- Enable hot reloading for development

### Production Build

Build for production:
```bash
npm run build:prod
```

The production build will be generated in the `dist` folder.

## Project Structure

```
├── src/
│   ├── html/       # HTML templates
│   ├── js/         # JavaScript source files
│   └── less/       # LESS/CSS styles
├── dist/           # Built files (generated)
├── server/         # Server configuration
└── build/          # Build configuration
```

## Technologies

- **Build Tool**: Webpack
- **Styling**: LESS/CSS with PatternFly
- **Server**: Node.js with Express
- **Development**: BrowserSync for hot reloading

## License

This project is open source and available under the [MIT License](LICENSE).
