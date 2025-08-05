import { Page } from "puppeteer"

export const getCanvas = async (page: Page) => {
    await page.waitForSelector('canvas.maplibregl-canvas', { timeout: 10000 });
    const canvas = await page.$('canvas.maplibregl-canvas');

    if(!canvas)  {
        throw new Error('Canvas not found')
    }
    
    return { canvas }
}
