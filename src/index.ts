import axios from 'axios';
import { config } from 'dotenv';
import puppeteer from 'puppeteer';
config();

console.log('Starting...')

const token = process.env.TOKEN

interface DrawProps {
    colors: number[];
    coords: number[];
}

const draw = async ({ colors, coords }: DrawProps) => {
    const response = await axios.post('https://backend.wplace.live/s0/pixel/723/1181', 
        {
            colors,
            coords
        },
        {
        headers: {
            'Cookie': token
        }
    })
}

// draw({ colors: [19], coords: [624, 779] })


const runBot = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()

    await page.setCookie({
        name: 's',
        value: token!,
        domain: '.backend.wplace.live',
        path: '/',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })

    
    
    await page.goto('https://wplace.live/')

    await page.evaluate(() => {
        localStorage.setItem('location', '{"lat":-26.764048609132622,"lng":-52.853967590747274,"zoom":14.86242603651587}');
    });
    
    console.log('Waiting for paint button...')

    await new Promise(r => setTimeout(r, 3000));

    await page.waitForSelector('button.btn.btn-primary.btn-lg.sm\\:btn-xl.relative.z-30');
    const paintButton = await page.$('button.btn.btn-primary.btn-lg.sm\\:btn-xl.relative.z-30');
    
    if (paintButton) {
        await paintButton.click();
        console.log('Paint button clicked successfully!');
    } else {
        console.log('Paint button not found');
    }
}

runBot()