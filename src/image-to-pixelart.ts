import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';
import { Pixel, PixelArt } from './types';

// Cores disponíveis no formato RGB
const availableColors: { [key: number]: [number, number, number] } = {
    0: [255, 255, 255], // Transparent (branco para representar transparente)
    1: [0, 0, 0],       // Black
    2: [64, 64, 64],    // Dark Gray
    3: [128, 128, 128], // Gray
    4: [192, 192, 192], // Light Gray
    5: [255, 255, 255], // White
    6: [128, 0, 0],     // Deep Red
    7: [255, 0, 0],     // Red
    8: [255, 128, 0],   // Orange
    9: [255, 215, 0],   // Gold
    10: [255, 255, 0],  // Yellow
    11: [255, 255, 128], // Light Yellow
    12: [0, 64, 0],     // Dark Green
    13: [0, 128, 0],    // Green
    14: [128, 255, 128], // Light Green
    15: [0, 64, 64],    // Dark Teal
    16: [0, 128, 128],  // Teal
    17: [128, 255, 255], // Light Teal
    18: [0, 0, 64],     // Dark Blue
    19: [0, 0, 128],    // Blue
    20: [0, 255, 255],  // Cyan
    21: [64, 0, 128],   // Indigo
    22: [128, 128, 255], // Light Indigo
    23: [64, 0, 64],    // Dark Purple
    24: [128, 0, 128],  // Purple
    25: [255, 128, 255], // Light Purple
    26: [64, 0, 32],    // Dark Pink
    27: [255, 0, 128],  // Pink
    28: [255, 192, 203], // Light Pink
    29: [64, 32, 0],    // Dark Brown
    30: [128, 64, 0],   // Brown
    31: [245, 245, 220] // Beige
};

interface ImageToPixelArtOptions {
    imagePath: string;
    maxWidth?: number;
    maxHeight?: number;
    dithering?: boolean;
}

/**
 * Calcula a distância euclidiana entre duas cores RGB
 */
function colorDistance(color1: [number, number, number], color2: [number, number, number]): number {
    return Math.sqrt(
        Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2)
    );
}

/**
 * Encontra a cor mais próxima disponível
 */
function findClosestColor(r: number, g: number, b: number): number {
    let closestColorIndex = 1; // Default to black
    let minDistance = Infinity;

    for (const [colorIndex, [r2, g2, b2]] of Object.entries(availableColors)) {
        const distance = colorDistance([r, g, b], [r2, g2, b2]);
        if (distance < minDistance) {
            minDistance = distance;
            closestColorIndex = parseInt(colorIndex);
        }
    }

    return closestColorIndex;
}

/**
 * Aplica dithering Floyd-Steinberg para melhorar a qualidade da conversão
 */
function applyDithering(
    imageData: any,
    width: number,
    height: number,
    x: number,
    y: number,
    errorR: number,
    errorG: number,
    errorB: number
): void {
    const distributeError = (dx: number, dy: number, factor: number) => {
        const newX = x + dx;
        const newY = y + dy;
        
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
            const index = (newY * width + newX) * 4;
            imageData.data[index] = Math.max(0, Math.min(255, imageData.data[index] + errorR * factor));
            imageData.data[index + 1] = Math.max(0, Math.min(255, imageData.data[index + 1] + errorG * factor));
            imageData.data[index + 2] = Math.max(0, Math.min(255, imageData.data[index + 2] + errorB * factor));
        }
    };

    // Distribui o erro para os pixels vizinhos (Floyd-Steinberg)
    distributeError(1, 0, 7/16);
    distributeError(-1, 1, 3/16);
    distributeError(0, 1, 5/16);
    distributeError(1, 1, 1/16);
}

/**
 * Converte uma imagem para PixelArt e salva em arquivo JSON
 */
export async function imageToPixelArt(options: ImageToPixelArtOptions): Promise<PixelArt> {
    const { imagePath, maxWidth = 100, maxHeight = 100, dithering = true } = options;

    // Carrega a imagem
    const image = await loadImage(imagePath);
    
    // Calcula as dimensões mantendo a proporção
    const aspectRatio = image.width / image.height;
    let targetWidth = maxWidth;
    let targetHeight = maxHeight;

    if (aspectRatio > 1) {
        targetHeight = Math.round(maxWidth / aspectRatio);
    } else {
        targetWidth = Math.round(maxHeight * aspectRatio);
    }

    // Cria um canvas para processar a imagem
    const canvas = createCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d');

    // Desenha a imagem redimensionada
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    // Obtém os dados da imagem
    const imageData: any = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const pixels: Pixel[] = [];

    // Processa cada pixel
    for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
            const index = (y * targetWidth + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const a = imageData.data[index + 3];

            // Se o pixel é transparente, pula
            if (a < 128) {
                continue;
            }

            // Encontra a cor mais próxima
            const closestColorIndex = findClosestColor(r, g, b);
            const targetColor = availableColors[closestColorIndex];

            if (dithering) {
                // Calcula o erro de quantização
                const errorR = r - targetColor[0];
                const errorG = g - targetColor[1];
                const errorB = b - targetColor[2];

                // Aplica dithering
                applyDithering(imageData, targetWidth, targetHeight, x, y, errorR, errorG, errorB);
            }

            // Adiciona o pixel à lista com flag painted = false
            pixels.push({
                x,
                y,
                color: closestColorIndex,
                painted: false
            });
        }
    }

    const pixelArt: PixelArt = { pixels };

    // Salva o pixel art em arquivo JSON
    const outputDir = path.dirname(imagePath);
    const baseName = path.basename(imagePath, path.extname(imagePath));
    const jsonPath = path.join(outputDir, `${baseName}_pixelart.json`);
    
    fs.writeFileSync(jsonPath, JSON.stringify(pixelArt, null, 2));
    console.log(`Pixel art salvo em: ${jsonPath}`);

    return pixelArt;
}

/**
 * Salva o pixel art atualizado com flags painted em arquivo JSON
 */
export function savePixelArtToJson(pixelArt: PixelArt, outputPath: string): void {
    fs.writeFileSync(outputPath, JSON.stringify(pixelArt, null, 2));
    console.log(`Pixel art atualizado salvo em: ${outputPath}`);
}

/**
 * Função auxiliar para salvar a imagem processada (útil para debug)
 */
export async function saveProcessedImage(
    imagePath: string,
    outputPath: string,
    maxWidth: number = 100,
    maxHeight: number = 100
): Promise<void> {
    const pixelArt = await imageToPixelArt({ imagePath, maxWidth, maxHeight });
    
    const canvas = createCanvas(maxWidth, maxHeight);
    const ctx = canvas.getContext('2d');

    // Desenha cada pixel
    for (const pixel of pixelArt.pixels) {
        const color = availableColors[pixel.color];
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.fillRect(pixel.x, pixel.y, 1, 1);
    }

    // Salva a imagem
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
} 