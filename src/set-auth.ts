import { Page } from "puppeteer";
import { env } from "./env";

export const setAuth = async (page: Page) => {
    await page.setCookie({
        name: 's',
        value: env.token,
        domain: '.backend.wplace.live',
        path: '/',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
}

export const getChargesCount = async (page: Page): Promise<number> => {
    // Intercept network requests to get the /me response
    const response = await page.waitForResponse(
        response => response.url().includes('/me') && response.status() === 200,
        { timeout: 10000 }
    );

    try {
        const data = await response.json();
        console.log('User data received:', {
            name: data.name,
            charges: data.charges,
            pixelsPainted: data.pixelsPainted
        });
        
        return data.charges.count;
    } catch (error) {
        console.error('Error parsing /me response:', error);
        return 0; // Default fallback
    }
}
