import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.APP_ENV || 'local';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  const dbName = process.env.DB_NAME || 'turtlehub';
  
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database '${dbName}' created successfully (or already exists)`);
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await connection.end();
  }
}

createDatabase();
