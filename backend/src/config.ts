import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const PORT = Number(process.env.PORT) || 3000;
export const DB_ADDRESS = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
export const { ORIGIN_ALLOW } = process.env;
