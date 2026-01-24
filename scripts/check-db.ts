import "reflect-metadata";
import { AppDataSource } from "../src/infrastructure/config/data-source";
import dotenv from 'dotenv';
import path from 'path';

// Load env same way as seed script to be sure
const env = process.env.APP_ENV || 'local';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

async function check() {
    try {
        console.log(`Checking DB Connection...`);
        console.log(`HOST: ${process.env.DB_HOST}`);
        console.log(`DB: ${process.env.DB_NAME}`);

        await AppDataSource.initialize();
        console.log("Connected!");

        const result = await AppDataSource.query("SHOW TABLES");
        console.log("Tables:", result);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

check();
