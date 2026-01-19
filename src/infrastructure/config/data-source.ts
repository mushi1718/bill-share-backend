import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../database/entities/user.entity";
import { ExpenseGroup } from "../database/entities/expense-group.entity";
import { Expense } from "../database/entities/expense.entity";
import { GroupMember } from "../database/entities/group-member.entity";
import { ExpenseSplit } from "../database/entities/expense-split.entity";
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
    entities: [User, ExpenseGroup, Expense, GroupMember, ExpenseSplit],
    migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
    subscribers: [],
});
