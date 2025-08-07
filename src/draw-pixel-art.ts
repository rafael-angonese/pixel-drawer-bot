
import { confirmPaint } from './confirm-paint';
import { getCanvas } from './get-canvas';
import { savePixelArtToJson } from './image-to-pixelart';
import { openPaintPalletStart } from './paint-button-start';
import { selectColor } from './select-color';
import { getChargesCount, setAuth } from './set-auth';
import { setStorageLocation } from './set-storage-location';
import { startBrowser } from './start-browser';
import { PixelArt } from './types';

export const drawPixelArt = async (pixelArt: PixelArt, token: string, maxPixelsToPaint?: number) => {

    const { page, browser } = await startBrowser()
    await setAuth(page, token)

    await page.goto('https://wplace.live/');

    // Get charges count from API
    const chargesCount = await getChargesCount(page);
    console.log(`Available charges: ${chargesCount}`);

    await setStorageLocation(page)
    await page.reload()
    await new Promise(r => setTimeout(r, 3000));

    // Use charges count as maxPixelsToPaint if not specified
    const actualMaxPixels = maxPixelsToPaint || chargesCount;
    console.log(`Will use ${actualMaxPixels} as max pixels to paint`);

    await openPaintPalletStart(page)

    await new Promise(r => setTimeout(r, 1000));

    const { canvas } = await getCanvas(page)

    await new Promise(r => setTimeout(r, 2000));

    const canvasBox = await canvas.boundingBox();

    if (!canvasBox) {
        throw new Error('Could not get canvas bounding box')
    }

    console.log(`Canvas dimensions: x=${canvasBox.x}, y=${canvasBox.y}, width=${canvasBox.width}, height=${canvasBox.height}`);

    // Filter unpainted pixels
    const unpaintedPixels = pixelArt.pixels.filter(p => !p.painted);
    console.log(`Found ${unpaintedPixels.length} unpainted pixels`);

    // Limit the number of pixels to paint based on charges count
    const pixelsToPaint = unpaintedPixels.slice(0, actualMaxPixels);

    if (pixelsToPaint.length === 0) {
        console.log('No pixels to paint! All pixels are already painted.');
        return;
    }

    console.log(`Will paint ${pixelsToPaint.length} pixels in this session`);

    let paintedCount = 0;
    for (const pixel of pixelsToPaint) {
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
        paintedCount++;

        // Show progress
        console.log(`Progress: ${paintedCount}/${pixelsToPaint.length} pixels painted`);
        // await new Promise(r => setTimeout(r, 300));
    }

    console.log(`Session completed! Painted ${paintedCount} pixels.`);

    await confirmPaint(page)

    // Save updated pixel art with painted flags
    const outputDir = './assets';
    const jsonPath = `${outputDir}/teste_pixelart.json`;
    savePixelArtToJson(pixelArt, jsonPath);

    await browser.close();
}
