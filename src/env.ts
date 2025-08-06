import { config } from 'dotenv';
config();

export const env = {
    tokens: process.env.TOKEN!.split(',').map(token => token.trim()).filter(token => token.length > 0)
}