import { Page } from "puppeteer"

export const openPaintPalletStart = async (page: Page) => {
    await page.waitForSelector('button.btn.btn-primary.btn-lg.sm\\:btn-xl.relative');
    const paintButton = await page.$('button.btn.btn-primary.btn-lg.sm\\:btn-xl.relative');
    
    if(paintButton) {
        await paintButton.click();
    }
}
