
import { drawPixelArt } from './draw-pixel-art';
import { env } from './env';
import { getCurrentPixelArt } from './get-current-pixel-art';

export const main = async () => {
    const { pixelArt } = await getCurrentPixelArt()

    if(!pixelArt) {
        throw new Error('pixelArt not found')
    }

    console.log(`Total pixels: ${pixelArt.pixels.length}`);
    console.log(`Painted pixels: ${pixelArt.pixels.filter(p => p.painted).length}`);
    console.log(`Unpainted pixels: ${pixelArt.pixels.filter(p => !p.painted).length}`);

    console.log(`\nFound ${env.tokens.length} tokens to process...`);
    
    for (let i = 0; i < env.tokens.length; i++) {
        const token = env.tokens[i];
        console.log(`\n=== Processing Account ${i + 1}/${env.tokens.length} ===`);
        // console.log(`Token: ${token}`);
        
        try {
            await drawPixelArt(pixelArt, token);
            console.log(`✓ Account ${i + 1} completed successfully`);
        } catch (error) {
            console.error(`✗ Error processing account ${i + 1}:`, error);
        }
        
        if (i < env.tokens.length - 1) {
            console.log('Waiting 5 seconds before next account...');
            await new Promise(r => setTimeout(r, 5000));
        }
    }
    
    console.log('\n=== All accounts processed ===');
}
