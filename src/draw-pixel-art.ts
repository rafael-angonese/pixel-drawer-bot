
import { confirmPaint } from './confirm-paint';
import { getCanvas } from './get-canvas';
import { getChargesCount } from './get-charges-count';
import { savePixelArtToJson } from './image-to-pixelart';
import { openPaintPalletStart } from './paint-button-start';
import { selectColor } from './select-color';
import { setAuth } from './set-auth';

import { setStorageLocation } from './set-storage-location';
import { startBrowser } from './start-browser';
import { PixelArt } from './types';

export const drawPixelArt = async (pixelArt: PixelArt, token: string) => {

    const { page, browser } = await startBrowser()
    await setAuth(page, token)

    await page.goto('https://wplace.live/');

    const chargesCount = await getChargesCount(page);
    console.log(`Available charges: ${chargesCount}`);

    await setStorageLocation(page)
    await page.reload()
    await new Promise(r => setTimeout(r, 3000));

    console.log(`Will use ${chargesCount} as max pixels to paint`);

    await openPaintPalletStart(page)

    await new Promise(r => setTimeout(r, 1000));

    const { canvas } = await getCanvas(page)

    await new Promise(r => setTimeout(r, 2000));

    const canvasBox = await canvas.boundingBox();

    if (!canvasBox) {
        throw new Error('Could not get canvas bounding box')
    }

    console.log(`Canvas dimensions: x=${canvasBox.x}, y=${canvasBox.y}, width=${canvasBox.width}, height=${canvasBox.height}`);

    const unpaintedPixels = pixelArt.pixels.filter(p => !p.painted);
    console.log(`Found ${unpaintedPixels.length} unpainted pixels`);

    const pixelsToPaint = unpaintedPixels.slice(0, chargesCount);

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

        pixel.painted = true;
        paintedCount++;

        console.log(`Progress: ${paintedCount}/${pixelsToPaint.length} pixels painted`);
        // await new Promise(r => setTimeout(r, 300));
    }

    console.log(`Session completed! Painted ${paintedCount} pixels.`);

    await confirmPaint(page)

    const outputDir = './assets';
    const jsonPath = `${outputDir}/teste_pixelart.json`;
    savePixelArtToJson(pixelArt, jsonPath);

    await browser.close();
}
