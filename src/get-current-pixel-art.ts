import * as fs from 'fs';
import { imageToPixelArt, saveProcessedImage } from "./image-to-pixelart";
import { PixelArt } from "./types";

export const getCurrentPixelArt = async () => {
    const jsonPath = './assets/pixelart.json'
    let pixelArt: PixelArt | null = null;

    if (fs.existsSync(jsonPath)) {
        const pixelArtData = fs.readFileSync(jsonPath, 'utf8');
        pixelArt = JSON.parse(pixelArtData);
        console.log(`Loaded pixel art from: ${jsonPath}`);
    }

    if (!fs.existsSync(jsonPath)) {
        console.log(`JSON file not found: ${jsonPath}`);
        console.log('Generating pixel art from image...');

        pixelArt = await imageToPixelArt({
            imagePath: './assets/input.png',
            maxWidth: 90,
            maxHeight: 90,
            dithering: true
        });

        await saveProcessedImage(
            './assets/input.png',
            90,
            90
        );

        console.log('Pixel art generated and saved to JSON file.');
    }

    return { pixelArt }
}
