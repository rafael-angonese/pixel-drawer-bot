
import { confirmPaint } from './confirm-paint';
import { heartPixelArt } from './examples/heart';
import { getCanvas } from './get-canvas';
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
        console.log(`Processing pixel: (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);

        await selectColor({
            page,
            colorIndex: pixel.color
        });
        await new Promise(r => setTimeout(r, 300));

        // Calculate pixel position on canvas (multiply by 10 since each pixel is 10x10)
        const pixelX = canvasBox.x + (pixel.x * 10);
        const pixelY = canvasBox.y + (pixel.y * 10);

        console.log(`Clicking at canvas coordinates: (${pixelX}, ${pixelY})`);

        await page.mouse.click(pixelX, pixelY);
        console.log(`✓ Drew pixel at (${pixel.x}, ${pixel.y}) with color ${pixel.color}`);
        await new Promise(r => setTimeout(r, 300));
    }

    await confirmPaint(page)
    // await browser.close();
}


import { imageToPixelArt, saveProcessedImage } from './image-to-pixelart';
const teste = async () => {

    const pixelArt = await imageToPixelArt({
        imagePath: './assets/teste.png',
        maxWidth: 141,
        maxHeight: 79,
        dithering: true
    });

    console.log(pixelArt)

    await saveProcessedImage(
        './assets/teste.png',
        './output/preview.png',
        141,
        79
    );

    drawPixelArt(pixelArt);
}

teste()

// drawPixelArt(heartPixelArt);