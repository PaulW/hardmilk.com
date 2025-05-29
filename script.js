// Main script for the Cheese Wedge page using the PNG image directly
let animationId = null;
let bounceTime = 0;
let textTime = 0; // Separate time counter for text animation
let cheeseImage = null;

// Canvas dimensions
let canvasWidth, canvasHeight;

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("cheese-wedge");
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimization: disable alpha for better performance
    
    // Load the cheese wedge image
    cheeseImage = new Image();
    
    // Ensure image is properly cached
    if (window.location.protocol !== 'file:') {
        cheeseImage.crossOrigin = "Anonymous";
    }
    
    cheeseImage.src = 'cheese.png';
    
    // Start once the image is loaded
    cheeseImage.onload = () => {
        console.log(`Cheese image loaded: ${cheeseImage.width}x${cheeseImage.height}`);
        
        // Set initial canvas size
        resizeCanvas(canvas);
        
        // Add resize listener with debounce to avoid excessive calls
        let resizeTimeout;
        window.addEventListener("resize", () => {
            // Cancel the previous timeout if a new resize event comes in
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            // Set a new timeout
            resizeTimeout = setTimeout(() => {
                resizeCanvas(canvas);
                resizeTimeout = null;
            }, 100);
        });
        
        // Start the animation
        animate(canvas, ctx);
    };
    
    cheeseImage.onerror = (err) => {
        console.error("Error loading cheese image:", err);
    };
});

// Resize canvas based on window size
function resizeCanvas(canvas) {
    // Get the container dimensions
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Set canvas dimensions to fill the container while maintaining aspect ratio
    const aspectRatio = 4/3; // Width/Height ratio that works well for the cheese wedge
    
    if (containerWidth / containerHeight > aspectRatio) {
        // Container is wider than needed
        canvasHeight = Math.min(containerHeight, 800); // Cap max height
        canvasWidth = canvasHeight * aspectRatio;
    } else {
        // Container is taller than needed
        canvasWidth = Math.min(containerWidth, 800); // Cap max width
        canvasHeight = canvasWidth / aspectRatio;
    }
    
    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Calculate the smallest dimension of the canvas
    const smallestDimension = Math.min(canvasWidth, canvasHeight);
    
    // We want the cheese to be at most 35% of the smallest dimension
    const maxCheeseSize = smallestDimension * 0.35;
    
    // Calculate the scale factor based on the original image dimensions
    const imageAspectRatio = cheeseImage.width / cheeseImage.height;
    let scaledWidth, scaledHeight;
    
    if (imageAspectRatio > 1) {
        // Image is wider than tall
        scaledWidth = maxCheeseSize;
        scaledHeight = scaledWidth / imageAspectRatio;
    } else {
        // Image is taller than wide
        scaledHeight = maxCheeseSize;
        scaledWidth = scaledHeight * imageAspectRatio;
    }
    
    // Store these for use in animation
    cheeseImage.scaledWidth = scaledWidth;
    cheeseImage.scaledHeight = scaledHeight;
    
    // Log for debugging
    console.log(`Canvas resized: ${canvasWidth}x${canvasHeight}, Cheese size: ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}px (${(Math.max(scaledWidth, scaledHeight) / smallestDimension * 100).toFixed(1)}% of smallest dimension, C64-style hard bounce)`);
}

function animate(canvas, ctx) {
    // For consistent retro C64-style bouncing
    bounceTime += 0.05; // Controls bounce speed
    textTime += 0.08; // Controls text snake motion speed (slightly faster)
    
    // Calculate bounce parameters for a C64-style hard bounce
    const bounceHeight = (canvasHeight - cheeseImage.scaledHeight) * 0.25;
    
    // Use absolute sine for classic bouncing ball effect (hard bounce at bottom)
    const bouncePosition = Math.abs(Math.sin(bounceTime)) * bounceHeight;
    
    // Clear the canvas and fill with the mellow cheddar yellow background
    ctx.fillStyle = "#ffd466"; // Mellow cheddar yellow background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the cheese wedge
    drawCheeseWedge(ctx, bouncePosition);
    
    // Draw the "CHEESE" text with snake motion
    drawCheeseText(ctx);
    
    // Continue animation
    animationId = requestAnimationFrame(() => animate(canvas, ctx));
}

// C64-style 8x8 pixel font data for lowercase letters c, h, e, s
const C64_FONT = {
    'c': [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,0,0,0,0,0],
        [0,1,1,0,0,0,0,0],
        [0,1,1,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    'h': [
        [0,0,0,0,0,0,0,0],
        [0,1,1,0,0,0,0,0],
        [0,1,1,0,0,0,0,0],
        [0,1,1,1,1,1,0,0],
        [0,1,1,0,0,1,1,0],
        [0,1,1,0,0,1,1,0],
        [0,1,1,0,0,1,1,0],
        [0,0,0,0,0,0,0,0]
    ],
    'e': [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,0,0,1,1,0],
        [0,1,1,1,1,1,1,0],
        [0,1,1,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    's': [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,0],
        [0,1,1,0,0,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,0,0,1,1,0],
        [0,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0]
    ]
};

function drawC64Letter(ctx, letter, x, y, pixelSize) {
    const letterData = C64_FONT[letter];
    if (!letterData) return;
    
    // No need to save/restore context since we're only drawing rectangles
    // and fillStyle is set before each call
    
    // Draw each pixel of the letter
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (letterData[row][col] === 1) {
                ctx.fillRect(
                    x + col * pixelSize,
                    y + row * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
}

// Color palette for cycling text - cheese-themed with good contrast against #ffd466 background
const COLOR_PALETTE = [
    "#FF4500", // Orange Red
    "#FF6B35", // Vermillion  
    "#FF8C42", // Mandarin
    "#FFB347", // Peach
    "#FFA500", // Orange
    "#FF7F00", // Dark Orange
    "#E74C3C", // Red
    "#C0392B", // Dark Red
    "#8B4513", // Saddle Brown
    "#A0522D", // Sienna
    "#D2691E", // Chocolate
    "#B8860B"  // Dark Goldenrod
];

function getColorForLetter(letterIndex, time) {
    // Color changes every 250ms (0.25 seconds)
    const colorChangeInterval = 250; // milliseconds
    const currentTime = Date.now();
    const colorCyclePosition = Math.floor(currentTime / colorChangeInterval);
    
    // Right-to-left scrolling: later letters get colors that appeared earlier
    // This creates a wave effect moving from right to left
    const scrollOffset = letterIndex * 2; // Each letter is 2 steps behind the previous
    const colorIndex = (colorCyclePosition - scrollOffset) % COLOR_PALETTE.length;
    
    // Ensure positive index using a more efficient method
    return COLOR_PALETTE[(colorIndex + COLOR_PALETTE.length) % COLOR_PALETTE.length];
}

function drawCheeseText(ctx) {
    const text = "cheese"; // Lowercase for C64 authenticity
    
    // Calculate text size based on cheese width (25% more than cheese width)
    const textWidth = cheeseImage.scaledWidth * 1.25;
    const pixelSize = Math.max(2, Math.floor(textWidth / (text.length * 8))); // 8x8 letters
    const totalTextWidth = text.length * 8 * pixelSize;
    
    // Disable anti-aliasing for pixelated look
    ctx.imageSmoothingEnabled = false;
    
    // Calculate text position - overlapping with the cheese bounce area
    const bounceHeight = (canvasHeight - cheeseImage.scaledHeight) * 0.25;
    const cheeseTopY = (canvasHeight - cheeseImage.scaledHeight) / 2 - bounceHeight;
    const textY = cheeseTopY + (bounceHeight * 0.3); // Position text to overlap with cheese bounce
    
    // Pre-calculate shadow offsets for performance
    const shadowOffsetX = Math.max(1, Math.floor(pixelSize * 0.4)); // Shadow offset right
    const shadowOffsetY = Math.max(1, Math.floor(pixelSize * 0.6)); // Shadow offset down
    const letterWidth = 8 * pixelSize;
    const baseXStart = canvasWidth / 2 - totalTextWidth / 2;
    
    // Create snake motion effect - each letter moves independently
    for (let i = 0; i < text.length; i++) {
        const letter = text[i];
        
        // Calculate horizontal position for this letter
        const baseX = baseXStart + (i * letterWidth);
        
        // Create snake motion with phase offset for each letter
        const phaseOffset = i * 0.8; // Each letter is slightly behind the previous one
        const snakeAmplitude = pixelSize * 3; // How much the letters move up and down
        const snakeY = Math.sin(textTime + phaseOffset) * snakeAmplitude;
        
        // Add slight horizontal snake motion too
        const snakeX = Math.cos(textTime * 0.7 + phaseOffset) * (pixelSize * 1.5);
        
        // Calculate final positions once
        const finalX = Math.round(baseX + snakeX);
        const finalY = Math.round(textY + snakeY);
        
        // Get the cycling color for this letter
        const letterColor = getColorForLetter(i, textTime);
        
        // Draw drop shadow first (positioned down and to the right as if light is from top-left)
        ctx.save();
        ctx.globalAlpha = 0.6; // 60% opacity for the shadow
        ctx.fillStyle = "#000000";
        drawC64Letter(ctx, letter, finalX + shadowOffsetX, finalY + shadowOffsetY, pixelSize);
        ctx.restore();
        
        // Draw main letter in cycling color with full opacity
        ctx.fillStyle = letterColor;
        drawC64Letter(ctx, letter, finalX, finalY, pixelSize);
    }
}

function drawCheeseWedge(ctx, yOffset) {
    // Center horizontally, and position at the vertical center point (for the lowest point of bounce)
    const xPosition = (canvasWidth - cheeseImage.scaledWidth) / 2;
    // Position at vertical center plus bounce height to make the center be the lowest point
    const bounceHeight = (canvasHeight - cheeseImage.scaledHeight) * 0.25;
    const yPosition = (canvasHeight - cheeseImage.scaledHeight) / 3 + bounceHeight;
    
    // Apply the positioning with bounce offset
    ctx.save();
    
    // Apply pixelated rendering to enhance 8-bit look
    ctx.imageSmoothingEnabled = false;
    
    // Draw the image at the calculated position with bounce offset
    // Round positions to ensure pixel-perfect rendering
    ctx.drawImage(
        cheeseImage, 
        Math.round(xPosition), 
        Math.round(yPosition - yOffset),
        Math.round(cheeseImage.scaledWidth),
        Math.round(cheeseImage.scaledHeight)
    );
    
    ctx.restore();
}

// Add event listener for orientation change on mobile
window.addEventListener("orientationchange", () => {
    // Small delay to ensure dimensions have updated after orientation change
    setTimeout(() => {
        const canvas = document.getElementById("cheese-wedge");
        resizeCanvas(canvas);
    }, 200);
});

// Clean up resources when page is unloaded to prevent memory leaks
window.addEventListener("beforeunload", () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});
