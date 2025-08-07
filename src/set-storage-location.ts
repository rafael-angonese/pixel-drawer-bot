import { Page } from "puppeteer";
import { env } from "./env";

export const setStorageLocation = async (page: Page) => {
    await page.evaluate((locationData) => {
        localStorage.setItem('location', JSON.stringify(locationData));
        localStorage.setItem('view-rules', 'true');
    }, {
        lat: env.LATITUDE,
        lng: env.LONGITUDE,
        zoom: 15.3
    });
}
