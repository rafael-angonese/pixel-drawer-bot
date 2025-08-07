import { Page } from "puppeteer";

export const getChargesCount = async (page: Page): Promise<number> => {
    try {
        const data = await page.evaluate(async () => {
            const res = await fetch('https://backend.wplace.live/me', { credentials: 'include', cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch /me');
            return res.json();
        });
        console.log('User data received:', {
            name: data.name,
            charges: data.charges,
            pixelsPainted: data.pixelsPainted
        });
        return data.charges.count;
    } catch (error) {
        console.error('Error fetching /me:', error);
        return 0;
    }
};

// export const getChargesCount = async (page: Page): Promise<number> => {
//     // Intercept network requests to get the /me response
//     const response = await page.waitForResponse(
//         response => response.url().includes('/me') && response.status() === 200,
//         { timeout: 10000 }
//     );

//     try {
//         const data = await response.json();
//         console.log('User data received:', {
//             name: data.name,
//             charges: data.charges,
//             pixelsPainted: data.pixelsPainted
//         });
        
//         return data.charges.count;
//     } catch (error) {
//         console.error('Error parsing /me response:', error);
//         return 0; // Default fallback
//     }
// }
