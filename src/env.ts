import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
    TOKEN: z.string().min(1, 'TOKEN is required'),
    EXECUTION_INTERVAL_MINUTES: z.string().optional().default('15').transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error('EXECUTION_INTERVAL_MINUTES must be a positive number');
        }
        return parsed;
    }),
    LATITUDE: z.string().transform((val) => {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) {
            throw new Error('LATITUDE must be a valid number');
        }
        return parsed;
    }),
    LONGITUDE: z.string().transform((val) => {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) {
            throw new Error('LONGITUDE must be a valid number');
        }
        return parsed;
    }),
    INPUT_FILE_NAME: z.string().optional().default('input.png'),
    MAX_IMAGE_WIDTH: z.string().optional().default('100').transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error('MAX_IMAGE_WIDTH must be a positive number');
        }
        return parsed;
    }),
    MAX_IMAGE_HEIGHT: z.string().optional().default('100').transform((val) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error('MAX_IMAGE_HEIGHT must be a positive number');
        }
        return parsed;
    }),
});

const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment validation failed:');
            console.error(error.message);
        }
        process.exit(1);
    }
};

const validatedEnv = parseEnv();

export const env = {
    tokens: validatedEnv.TOKEN.split(',').map(token => token.trim()).filter(token => token.length > 0),
    EXECUTION_INTERVAL_MINUTES: validatedEnv.EXECUTION_INTERVAL_MINUTES,
    LATITUDE: validatedEnv.LATITUDE,
    LONGITUDE: validatedEnv.LONGITUDE,
    INPUT_FILE_NAME: validatedEnv.INPUT_FILE_NAME,
    MAX_IMAGE_WIDTH: validatedEnv.MAX_IMAGE_WIDTH,
    MAX_IMAGE_HEIGHT: validatedEnv.MAX_IMAGE_HEIGHT,
} as const;