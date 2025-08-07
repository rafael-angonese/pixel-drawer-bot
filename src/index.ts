
import * as fs from 'fs';
import { drawPixelArt } from './draw-pixel-art';
import { env } from './env';
import { imageToPixelArt } from './image-to-pixelart';
import { PixelArt } from './types';



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

    // Run for each token/account
    console.log(`\nFound ${env.tokens.length} tokens to process...`);
    
    for (let i = 0; i < env.tokens.length; i++) {
        const token = env.tokens[i];
        console.log(`\n=== Processing Account ${i + 1}/${env.tokens.length} ===`);
        console.log(`Token: ${token}`);
        
        try {
            await drawPixelArt(pixelArt, token);
            console.log(`✓ Account ${i + 1} completed successfully`);
        } catch (error) {
            console.error(`✗ Error processing account ${i + 1}:`, error);
        }
        
        // Add a small delay between accounts
        if (i < env.tokens.length - 1) {
            console.log('Waiting 5 seconds before next account...');
            await new Promise(r => setTimeout(r, 5000));
        }
    }
    
    console.log('\n=== All accounts processed ===');
}

// Configuração do intervalo de execução (em minutos)
const EXECUTION_INTERVAL_MINUTES = 15;

const runInfiniteLoop = async () => {
    console.log(`🚀 Iniciando execução em loop infinito`);
    console.log(`⏰ Intervalo configurado: ${EXECUTION_INTERVAL_MINUTES} minutos`);
    
    let executionCount = 0;
    
    while (true) {
        executionCount++;
        console.log(`\n🔄 === EXECUÇÃO #${executionCount} ===`);
        console.log(`📅 ${new Date().toLocaleString()}`);
        
        try {
            await teste();
            console.log(`✅ Execução #${executionCount} concluída com sucesso`);
        } catch (error) {
            console.error(`❌ Erro na execução #${executionCount}:`, error);
        }
        
        console.log(`⏳ Aguardando ${EXECUTION_INTERVAL_MINUTES} minutos até a próxima execução...`);
        console.log(`⏰ Próxima execução: ${new Date(Date.now() + EXECUTION_INTERVAL_MINUTES * 60 * 1000).toLocaleString()}`);
        
        // Aguarda o intervalo configurado
        await new Promise(resolve => setTimeout(resolve, EXECUTION_INTERVAL_MINUTES * 60 * 1000));
    }
}

// Executa o loop infinito
runInfiniteLoop().catch(error => {
    console.error('❌ Erro fatal no loop infinito:', error);
    process.exit(1);
});

// Comentando a execução única para usar o loop infinito
// teste()