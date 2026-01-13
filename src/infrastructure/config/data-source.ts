import "reflect-metadata";
import { DataSource } from "typeorm";
import { App } from "../database/entities/app.entity";
import { AppTranslation } from "../database/entities/app-translation.entity";
import { User } from "../database/entities/user.entity";
import { Workspace } from "../database/entities/workspace.entity";
import { WorkspaceApp } from "../database/entities/workspace-app.entity";
import { Template } from "../database/entities/workspace-template.entity";
import { TemplateTrans } from "../database/entities/workspace-template-translation.entity";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables if not already loaded (e.g. when running migrations)
const env = process.env.APP_ENV || 'local';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "app_center",
    synchronize: false,
    logging: false,
    entities: [App, AppTranslation, User, Workspace, WorkspaceApp, Template, TemplateTrans],
    migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
    subscribers: [],
});
