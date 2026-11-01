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

GitHub Pages serves the repository root, so the build writes its output there and
that output is committed: the root `*.html` pages (copied from `src/html`),
`main.bundle.js`, `charts.bundle.js` (with source maps), `css/main.css` and `fonts/`.
Edit the sources, run `npm run build:prod`, review the diff and commit the sources
together with the regenerated output. Do not edit the root pages by hand; they are
overwritten by the build.

## Project Structure

```
├── src/
│   ├── html/       # Page templates (copied to the repository root)
│   ├── js/         # JavaScript entry points and small helpers
│   └── css/        # site.css: PatternFly 3 look on top of Bootstrap 5
├── css/, fonts/    # Built stylesheet and icon fonts (generated, committed)
├── *.bundle.js     # Built scripts (generated, committed)
├── server/         # Development server
└── build/          # Webpack configuration
```

## Technologies

- **Build Tool**: Webpack
- **UI**: Bootstrap 5 with `src/css/site.css` (keeps the `*-pf` class names of the former PatternFly 3 markup), Font Awesome 6
- **Charts**: C3 and D3
- **Server**: Node.js with Express
- **Development**: BrowserSync for hot reloading

## License

This project is open source and available under the [MIT License](LICENSE).
