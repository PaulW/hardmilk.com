# hardmilk.com

A simple and fun web page that displays a bouncing cheese wedge with animated "CHEESE" text on a mellow cheddar-colored background, inspired by classic C64 demo animations.

## Features

- **C64-Style Animation**: Bouncing cheese wedge with classic 8-bit hard bounce physics
- **Cycling Color Text**: "CHEESE" text with authentic-styled C64 bitmap font rendering and rainbow color cycling (250ms intervals)
- **Snake Motion Text**: Letters move independently with wave effects, just like classic demo scenes
- **No External Dependencies**: All text rendering uses custom bitmap fonts

## How to Run

### Method 1: Open directly in a browser

Simply open the `index.html` file in your web browser to see the bouncing cheese wedge.

### Method 2: Use the Node.js server (Recommended)

1. Make sure you have Node.js installed
2. Navigate to the project directory in your terminal
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Open your browser and go to: `http://localhost:3001`

## Mobile Support

The animation is fully responsive and works on:
- Desktop browsers of any size
- Mobile phones in portrait and landscape orientations  
- Tablets and other devices
- Automatically adjusts when device orientation changes
- Touch-friendly with pinch-to-zoom disabled for optimal viewing

## Files

- `index.html` - Main HTML structure
- `style.css` - Responsive styling optimized for all devices
- `script.js` - Complete animation engine with C64 font rendering and color cycling
- `cheese.png` - Custom cheese wedge pixel art image (32×32px)
- `cheese.xcf` - GIMP source file for the cheese image
- `server.js` - Express server for local hosting
- `package.json` - Node.js project configuration
