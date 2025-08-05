import { config } from 'dotenv';
config();

export const env = {
    token: process.env.TOKEN!
}