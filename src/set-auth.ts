import { Page } from "puppeteer"
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
