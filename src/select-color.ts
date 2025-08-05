import { Page } from "puppeteer"

interface SelectColorProps {
    page: Page
    colorIndex: number
}

const colorMap: { [key: number]: string } = {
    0: 'Transparent',
    1: 'Black',
    2: 'Dark Gray',
    3: 'Gray',
    4: 'Light Gray',
    5: 'White',
    6: 'Deep Red',
    7: 'Red',
    8: 'Orange',
    9: 'Gold',
    10: 'Yellow',
    11: 'Light Yellow',
    12: 'Dark Green',
    13: 'Green',
    14: 'Light Green',
    15: 'Dark Teal',
    16: 'Teal',
    17: 'Light Teal',
    18: 'Dark Blue',
    19: 'Blue',
    20: 'Cyan',
    21: 'Indigo',
    22: 'Light Indigo',
    23: 'Dark Purple',
    24: 'Purple',
    25: 'Light Purple',
    26: 'Dark Pink',
    27: 'Pink',
    28: 'Light Pink',
    29: 'Dark Brown',
    30: 'Brown',
    31: 'Beige'
};

export const selectColor = async ({ page, colorIndex }: SelectColorProps) => {
    const colorName = colorMap[colorIndex];

    await page.waitForSelector(`button[aria-label="${colorName}"]`, { timeout: 5000 });
    const colorButton = await page.$(`button[aria-label="${colorName}"]`);

    if(!colorButton) {
        throw new Error('Color button not found')
    }

    await colorButton.click();
}
