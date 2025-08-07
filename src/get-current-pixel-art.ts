import * as fs from 'fs';
import { imageToPixelArt, saveProcessedImage } from "./image-to-pixelart";
import { PixelArt } from "./types";
import { INPUT_PATH, PIXEL_ART_PATH } from './constants';

export const getCurrentPixelArt = async () => {
    let pixelArt: PixelArt | null = null;

    if (fs.existsSync(PIXEL_ART_PATH)) {
        const pixelArtData = fs.readFileSync(PIXEL_ART_PATH, 'utf8');
        pixelArt = JSON.parse(pixelArtData);
        console.log(`Loaded pixel art from: ${PIXEL_ART_PATH}`);
    }

    if (!fs.existsSync(PIXEL_ART_PATH)) {
        console.log(`JSON file not found: ${PIXEL_ART_PATH}`);
        console.log('Generating pixel art from image...');

        pixelArt = await imageToPixelArt({
            imagePath: INPUT_PATH,
            maxWidth: 90,
            maxHeight: 90,
            dithering: true
        });

        await saveProcessedImage(
            INPUT_PATH,
            90,
            90
        );

        console.log('Pixel art generated and saved to JSON file.');
    }

    return { pixelArt }
}
