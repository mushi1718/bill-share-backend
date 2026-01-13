import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { loggerMiddleware } from './presentation/middlewares/logger.middleware';

// Load environment variables
const env = process.env.APP_ENV || 'local';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

import appRoutes from './presentation/routes/app.routes';
import authRoutes from './presentation/routes/auth.routes';
import userRoutes from './presentation/routes/user.routes';
import { AppDataSource } from './infrastructure/config/data-source';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use('/api/apps', appRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established successfully');
    app.listen(port, () => {
      console.log(`Server (${env}) listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });
