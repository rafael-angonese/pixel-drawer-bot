import { Page } from "puppeteer";

export const setAuth = async (page: Page, token: string) => {
    await page.setCookie({
        name: 's',
        value: token,
        domain: '.backend.wplace.live',
        path: '/',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
}