import puppeteer from "puppeteer";

export const startBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 900 });

    return { browser, page }
}
