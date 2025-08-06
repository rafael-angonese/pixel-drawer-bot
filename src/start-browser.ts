// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-extra"
import stealthPlugin from "puppeteer-extra-plugin-stealth"

export const startBrowser = async () => {
    puppeteer.use(stealthPlugin())

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 900 });

    return { browser, page }
}
