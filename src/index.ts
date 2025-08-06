
import * as fs from 'fs';
import { confirmPaint } from './confirm-paint';
import { getCanvas } from './get-canvas';
import { imageToPixelArt, savePixelArtToJson } from './image-to-pixelart';
import { openPaintPalletStart } from './paint-button-start';
import { selectColor } from './select-color';
import { setAuth } from './set-auth';
import { setStorageLocation } from './set-storage-location';
import { startBrowser } from './start-browser';
import { PixelArt } from './types';


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
        if (pixel.painted) {
            console.log(`Skipping already painted pixel: (${pixel.x}, ${pixel.y})`);
            continue;
        }

        console.log(`Processing pixel: (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);

        await selectColor({
            page,
            colorIndex: pixel.color
        });
        // await new Promise(r => setTimeout(r, 300));

        // Calculate pixel position on canvas (multiply by 10 since each pixel is 10x10)
        const pixelX = canvasBox.x + (pixel.x * 10);
        const pixelY = canvasBox.y + (pixel.y * 10);

        console.log(`Clicking at canvas coordinates: (${pixelX}, ${pixelY})`);

        await page.mouse.click(pixelX, pixelY);
        console.log(`✓ Drew pixel at (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);
        
        // Mark pixel as painted
        pixel.painted = true;
        // await new Promise(r => setTimeout(r, 300));
    }

    await confirmPaint(page)
    
    // Save updated pixel art with painted flags
    const outputDir = './assets';
    const jsonPath = `${outputDir}/teste_pixelart.json`;
    savePixelArtToJson(pixelArt, jsonPath);
    
    // await browser.close();
}


const teste = async () => {
    // Load pixel art from JSON file
    const jsonPath = './assets/teste_pixelart.json';
    let pixelArt: PixelArt;
    
    if (!fs.existsSync(jsonPath)) {
        console.log(`JSON file not found: ${jsonPath}`);
        console.log('Generating pixel art from image...');
        
        // Generate pixel art from image
        pixelArt = await imageToPixelArt({
            imagePath: './assets/teste.png',
            maxWidth: 141,
            maxHeight: 79,
            dithering: true
        });
        
        console.log('Pixel art generated and saved to JSON file.');
    } else {
        // Load existing pixel art from JSON
        const pixelArtData = fs.readFileSync(jsonPath, 'utf8');
        pixelArt = JSON.parse(pixelArtData);
        console.log(`Loaded pixel art from: ${jsonPath}`);
    }

    console.log(`Total pixels: ${pixelArt.pixels.length}`);
    console.log(`Painted pixels: ${pixelArt.pixels.filter(p => p.painted).length}`);
    console.log(`Unpainted pixels: ${pixelArt.pixels.filter(p => !p.painted).length}`);

    drawPixelArt(pixelArt);
}

teste()

// drawPixelArt(heartPixelArt);