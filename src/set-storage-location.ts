import { Page } from "puppeteer"

export const setStorageLocation = async (page: Page) => {
    await page.evaluate(() => {
        // localStorage.setItem('location', '{"lat":-26.764048609132622,"lng":-52.853967590747274,"zoom":14.86242603651587}');
        localStorage.setItem('location', '{"lat":-26.764048609132622,"lng":-52.853967590747274,"zoom":15.3}');
        // localStorage.setItem('location', '{"lat":-26.7596025878112,"lng":-52.86191627780312,"zoom":10.0}');
        localStorage.setItem('view-rules', 'true');
    });
}
