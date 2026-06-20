import { config } from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || "development"}`});

export const {
    NODE_ENV,
    DATABASE_URL,
    PORT,
    URL
} = process.env