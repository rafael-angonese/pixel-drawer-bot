import { Page } from "puppeteer";

export const confirmPaint = async (page: Page) => {
    const paintButtonAfter = await page.$('button.btn.btn-primary.btn-lg.sm\\:btn-xl.relative');
    if (paintButtonAfter) {
        await paintButtonAfter.click();
        console.log('Paint button clicked again successfully!');
    }
}
