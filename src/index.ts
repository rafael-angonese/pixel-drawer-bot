
import { startBrowser } from './start-browser';
import { PixelArt } from './types';
import { setAuth } from './set-auth';
import { setStorageLocation } from './set-storage-location';
import { openPaintPalletStart } from './paint-button-start';
import { getCanvas } from './get-canvas';
import { confirmPaint } from './confirm-paint';
import { selectColor } from './select-color';


const drawPixelArt = async (pixelArt: PixelArt) => {

    const { page } = await startBrowser()
    await setAuth(page)

    await page.goto('https://wplace.live/');
    await setStorageLocation(page)

    await new Promise(r => setTimeout(r, 3000));

    await openPaintPalletStart(page)

    await new Promise(r => setTimeout(r, 1000));

    const { canvas } = await getCanvas(page)

    await new Promise(r => setTimeout(r, 2000));

    const canvasBox = await canvas.boundingBox();

    if (!canvasBox) {
        throw new Error('Could not get canvas bounding box')
    }

    console.log(`Canvas dimensions: x=${canvasBox.x}, y=${canvasBox.y}, width=${canvasBox.width}, height=${canvasBox.height}`);

    for (const pixel of pixelArt.pixels) {
        console.log(`Processing pixel: (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);

        await selectColor({
            page,
            colorIndex: pixel.color
        });

        // Calculate pixel position on canvas
        const pixelX = canvasBox.x + (pixel.x * 1); // Assuming 1px per pixel
        const pixelY = canvasBox.y + (pixel.y * 1);

        console.log(`Clicking at canvas coordinates: (${pixelX}, ${pixelY})`);

        await page.mouse.click(pixelX, pixelY);
        console.log(`✓ Drew pixel at (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);
    }

    await confirmPaint(page)
    // await browser.close();
}


// const selectColor = async (page: any, colorIndex: number) => {
//     // Map of color indices to aria-labels based on the new HTML structure
//     const colorMap: { [key: number]: string } = {
//         0: 'Transparent',
//         1: 'Black',
//         2: 'Dark Gray',
//         3: 'Gray',
//         4: 'Light Gray',
//         5: 'White',
//         6: 'Deep Red',
//         7: 'Red',
//         8: 'Orange',
//         9: 'Gold',
//         10: 'Yellow',
//         11: 'Light Yellow',
//         12: 'Dark Green',
//         13: 'Green',
//         14: 'Light Green',
//         15: 'Dark Teal',
//         16: 'Teal',
//         17: 'Light Teal',
//         18: 'Dark Blue',
//         19: 'Blue',
//         20: 'Cyan',
//         21: 'Indigo',
//         22: 'Light Indigo',
//         23: 'Dark Purple',
//         24: 'Purple',
//         25: 'Light Purple',
//         26: 'Dark Pink',
//         27: 'Pink',
//         28: 'Light Pink',
//         29: 'Dark Brown',
//         30: 'Brown',
//         31: 'Beige'
//     };

//     const colorName = colorMap[colorIndex];
//     console.log(`Selecting color: ${colorName} (index: ${colorIndex})`);

//     if (colorName) {
//         try {
//             await page.waitForSelector(`button[aria-label="${colorName}"]`, { timeout: 5000 });
//             const colorButton = await page.$(`button[aria-label="${colorName}"]`);
//             if (colorButton) {
//                 await colorButton.click();
//                 console.log(`✓ Color ${colorName} selected successfully`);
//                 // await new Promise(r => setTimeout(r, 200));
//             } else {
//                 console.log(`✗ Color button for ${colorName} not found`);
//             }
//         } catch (error) {
//             console.log(`✗ Error selecting color ${colorName}:`, error);
//         }
//     } else {
//         console.log(`✗ Unknown color index: ${colorIndex}`);
//     }
// };

// Example pixel art - a heart
const heartPixelArt: PixelArt = {
    pixels: [
        // Coração pequeno
        { x: 100, y: 100, color: 26 }, // Dark Pink
        { x: 110, y: 100, color: 26 },
        { x: 120, y: 100, color: 26 },
        { x: 130, y: 100, color: 26 },
        { x: 140, y: 100, color: 26 },

        { x: 90, y: 110, color: 26 },
        { x: 100, y: 110, color: 27 }, // Pink
        { x: 110, y: 110, color: 27 },
        { x: 120, y: 110, color: 27 },
        { x: 130, y: 110, color: 27 },
        { x: 140, y: 110, color: 27 },
        { x: 150, y: 110, color: 26 },

        { x: 80, y: 120, color: 26 },
        { x: 90, y: 120, color: 27 },
        { x: 100, y: 120, color: 28 }, // Light Pink
        { x: 110, y: 120, color: 28 },
        { x: 120, y: 120, color: 28 },
        { x: 130, y: 120, color: 28 },
        { x: 140, y: 120, color: 28 },
        { x: 150, y: 120, color: 27 },
        { x: 160, y: 120, color: 26 },

        { x: 80, y: 130, color: 26 },
        { x: 90, y: 130, color: 27 },
        { x: 100, y: 130, color: 28 },
        { x: 110, y: 130, color: 28 },
        { x: 120, y: 130, color: 28 },
        { x: 130, y: 130, color: 28 },
        { x: 140, y: 130, color: 28 },
        { x: 150, y: 130, color: 27 },
        { x: 160, y: 130, color: 26 },

        { x: 90, y: 140, color: 26 },
        { x: 100, y: 140, color: 27 },
        { x: 110, y: 140, color: 28 },
        { x: 120, y: 140, color: 28 },
        { x: 130, y: 140, color: 28 },
        { x: 140, y: 140, color: 27 },
        { x: 150, y: 140, color: 26 },

        { x: 100, y: 150, color: 26 },
        { x: 110, y: 150, color: 27 },
        { x: 120, y: 150, color: 27 },
        { x: 130, y: 150, color: 27 },
        { x: 140, y: 150, color: 26 },

        { x: 110, y: 160, color: 26 },
        { x: 120, y: 160, color: 26 },
        { x: 130, y: 160, color: 26 },

        { x: 120, y: 170, color: 26 },
    ]
};

// Example pixel art - a small star
const starPixelArt: PixelArt = {
    pixels: [
        // Estrela pequena
        { x: 200, y: 100, color: 10 }, // Yellow

        { x: 190, y: 110, color: 10 },
        { x: 200, y: 110, color: 9 }, // Gold
        { x: 210, y: 110, color: 10 },

        { x: 180, y: 120, color: 10 },
        { x: 190, y: 120, color: 9 },
        { x: 200, y: 120, color: 8 }, // Orange
        { x: 210, y: 120, color: 9 },
        { x: 220, y: 120, color: 10 },

        { x: 170, y: 130, color: 10 },
        { x: 180, y: 130, color: 9 },
        { x: 190, y: 130, color: 8 },
        { x: 200, y: 130, color: 7 }, // Red
        { x: 210, y: 130, color: 8 },
        { x: 220, y: 130, color: 9 },
        { x: 230, y: 130, color: 10 },

        { x: 180, y: 140, color: 10 },
        { x: 190, y: 140, color: 9 },
        { x: 200, y: 140, color: 8 },
        { x: 210, y: 140, color: 9 },
        { x: 220, y: 140, color: 10 },

        { x: 190, y: 150, color: 10 },
        { x: 200, y: 150, color: 9 },
        { x: 210, y: 150, color: 10 },

        { x: 200, y: 160, color: 10 },
    ]
};

// Example pixel art - a small flower
const flowerPixelArt: PixelArt = {
    pixels: [
        // Flor pequena
        { x: 300, y: 100, color: 28 }, // Light Pink (center)

        // Petals
        { x: 290, y: 90, color: 27 }, // Pink
        { x: 310, y: 90, color: 27 },
        { x: 290, y: 110, color: 27 },
        { x: 310, y: 110, color: 27 },

        { x: 280, y: 100, color: 26 }, // Dark Pink
        { x: 320, y: 100, color: 26 },

        // Stem
        { x: 300, y: 120, color: 13 }, // Green
        { x: 300, y: 130, color: 13 },
        { x: 300, y: 140, color: 12 }, // Dark Green

        // Leaves
        { x: 290, y: 130, color: 14 }, // Light Green
        { x: 310, y: 130, color: 14 },
    ]
};

// Example pixel art - a small smiley face
const smileyPixelArt: PixelArt = {
    pixels: [
        // Smiley face
        { x: 400, y: 100, color: 10 }, // Yellow (main face)
        { x: 410, y: 100, color: 10 },
        { x: 420, y: 100, color: 10 },
        { x: 430, y: 100, color: 10 },
        { x: 440, y: 100, color: 10 },

        { x: 400, y: 110, color: 10 },
        { x: 410, y: 110, color: 10 },
        { x: 420, y: 110, color: 10 },
        { x: 430, y: 110, color: 10 },
        { x: 440, y: 110, color: 10 },

        { x: 400, y: 120, color: 10 },
        { x: 410, y: 120, color: 1 }, // Black (left eye)
        { x: 420, y: 120, color: 10 },
        { x: 430, y: 120, color: 1 }, // Black (right eye)
        { x: 440, y: 120, color: 10 },

        { x: 400, y: 130, color: 10 },
        { x: 410, y: 130, color: 10 },
        { x: 420, y: 130, color: 1 }, // Black (mouth)
        { x: 430, y: 130, color: 10 },
        { x: 440, y: 130, color: 10 },

        { x: 400, y: 140, color: 10 },
        { x: 410, y: 140, color: 10 },
        { x: 420, y: 140, color: 10 },
        { x: 430, y: 140, color: 10 },
        { x: 440, y: 140, color: 10 },
    ]
};

// Example pixel art - a small rainbow
const rainbowPixelArt: PixelArt = {
    pixels: [
        // Rainbow
        { x: 500, y: 100, color: 7 }, // Red
        { x: 510, y: 100, color: 8 }, // Orange
        { x: 520, y: 100, color: 10 }, // Yellow
        { x: 530, y: 100, color: 13 }, // Green
        { x: 540, y: 100, color: 19 }, // Blue
        { x: 550, y: 100, color: 24 }, // Purple

        { x: 500, y: 110, color: 7 },
        { x: 510, y: 110, color: 8 },
        { x: 520, y: 110, color: 10 },
        { x: 530, y: 110, color: 13 },
        { x: 540, y: 110, color: 19 },
        { x: 550, y: 110, color: 24 },

        { x: 500, y: 120, color: 7 },
        { x: 510, y: 120, color: 8 },
        { x: 520, y: 120, color: 10 },
        { x: 530, y: 120, color: 13 },
        { x: 540, y: 120, color: 19 },
        { x: 550, y: 120, color: 24 },
    ]
};

// Example pixel art - writing "rafael"
const rafaelPixelArt: PixelArt = {
    pixels: [
        // Letter R
        { x: 100, y: 100, color: 19 }, // Blue
        { x: 110, y: 100, color: 19 },
        { x: 120, y: 100, color: 19 },
        { x: 130, y: 100, color: 19 },
        { x: 140, y: 100, color: 19 },

        { x: 100, y: 110, color: 19 },
        { x: 140, y: 110, color: 19 },

        { x: 100, y: 120, color: 19 },
        { x: 140, y: 120, color: 19 },

        { x: 100, y: 130, color: 19 },
        { x: 110, y: 130, color: 19 },
        { x: 120, y: 130, color: 19 },
        { x: 130, y: 130, color: 19 },

        { x: 100, y: 140, color: 19 },
        { x: 110, y: 140, color: 19 },
        { x: 120, y: 140, color: 19 },
        { x: 130, y: 140, color: 19 },
        { x: 140, y: 140, color: 19 },

        { x: 100, y: 150, color: 19 },
        { x: 140, y: 150, color: 19 },

        { x: 100, y: 160, color: 19 },
        { x: 140, y: 160, color: 19 },

        // Letter A
        { x: 160, y: 100, color: 7 }, // Red
        { x: 170, y: 100, color: 7 },
        { x: 180, y: 100, color: 7 },
        { x: 190, y: 100, color: 7 },
        { x: 200, y: 100, color: 7 },

        { x: 160, y: 110, color: 7 },
        { x: 200, y: 110, color: 7 },

        { x: 160, y: 120, color: 7 },
        { x: 200, y: 120, color: 7 },

        { x: 160, y: 130, color: 7 },
        { x: 170, y: 130, color: 7 },
        { x: 180, y: 130, color: 7 },
        { x: 190, y: 130, color: 7 },
        { x: 200, y: 130, color: 7 },

        { x: 160, y: 140, color: 7 },
        { x: 200, y: 140, color: 7 },

        { x: 160, y: 150, color: 7 },
        { x: 200, y: 150, color: 7 },

        { x: 160, y: 160, color: 7 },
        { x: 200, y: 160, color: 7 },

        // Letter F
        { x: 220, y: 100, color: 13 }, // Green
        { x: 230, y: 100, color: 13 },
        { x: 240, y: 100, color: 13 },
        { x: 250, y: 100, color: 13 },
        { x: 260, y: 100, color: 13 },

        { x: 220, y: 110, color: 13 },

        { x: 220, y: 120, color: 13 },

        { x: 220, y: 130, color: 13 },
        { x: 230, y: 130, color: 13 },
        { x: 240, y: 130, color: 13 },
        { x: 250, y: 130, color: 13 },
        { x: 260, y: 130, color: 13 },

        { x: 220, y: 140, color: 13 },

        { x: 220, y: 150, color: 13 },

        { x: 220, y: 160, color: 13 },

        // Letter A (second)
        { x: 280, y: 100, color: 8 }, // Orange
        { x: 290, y: 100, color: 8 },
        { x: 300, y: 100, color: 8 },
        { x: 310, y: 100, color: 8 },
        { x: 320, y: 100, color: 8 },

        { x: 280, y: 110, color: 8 },
        { x: 320, y: 110, color: 8 },

        { x: 280, y: 120, color: 8 },
        { x: 320, y: 120, color: 8 },

        { x: 280, y: 130, color: 8 },
        { x: 290, y: 130, color: 8 },
        { x: 300, y: 130, color: 8 },
        { x: 310, y: 130, color: 8 },
        { x: 320, y: 130, color: 8 },

        { x: 280, y: 140, color: 8 },
        { x: 320, y: 140, color: 8 },

        { x: 280, y: 150, color: 8 },
        { x: 320, y: 150, color: 8 },

        { x: 280, y: 160, color: 8 },
        { x: 320, y: 160, color: 8 },

        // Letter E
        { x: 340, y: 100, color: 10 }, // Yellow
        { x: 350, y: 100, color: 10 },
        { x: 360, y: 100, color: 10 },
        { x: 370, y: 100, color: 10 },
        { x: 380, y: 100, color: 10 },

        { x: 340, y: 110, color: 10 },

        { x: 340, y: 120, color: 10 },

        { x: 340, y: 130, color: 10 },
        { x: 350, y: 130, color: 10 },
        { x: 360, y: 130, color: 10 },
        { x: 370, y: 130, color: 10 },
        { x: 380, y: 130, color: 10 },

        { x: 340, y: 140, color: 10 },

        { x: 340, y: 150, color: 10 },

        { x: 340, y: 160, color: 10 },
        { x: 350, y: 160, color: 10 },
        { x: 360, y: 160, color: 10 },
        { x: 370, y: 160, color: 10 },
        { x: 380, y: 160, color: 10 },

        // Letter L
        { x: 400, y: 100, color: 24 }, // Purple
        { x: 400, y: 110, color: 24 },
        { x: 400, y: 120, color: 24 },
        { x: 400, y: 130, color: 24 },
        { x: 400, y: 140, color: 24 },
        { x: 400, y: 150, color: 24 },
        { x: 400, y: 160, color: 24 },
        { x: 410, y: 160, color: 24 },
        { x: 420, y: 160, color: 24 },
        { x: 430, y: 160, color: 24 },
        { x: 440, y: 160, color: 24 },
    ]
};

// Choose which pixel art to draw
// drawPixelArt(heartPixelArt);
// drawPixelArt(starPixelArt);
// drawPixelArt(flowerPixelArt);
// drawPixelArt(smileyPixelArt);
// drawPixelArt(rainbowPixelArt);
drawPixelArt(rafaelPixelArt);