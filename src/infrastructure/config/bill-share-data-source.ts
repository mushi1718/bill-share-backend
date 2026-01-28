import { DataSource } from "typeorm";
import { ExpenseGroup } from "../database/entities/expense-group.entity";
import { GroupMember } from "../database/entities/group-member.entity";
import { Expense } from "../database/entities/expense.entity";
import { ExpenseSplit } from "../database/entities/expense-split.entity";
import { ExpenseLog } from "../database/entities/expense-log.entity";
import { User } from "../database/entities/user.entity";
import { ExpenseStrategyInput } from "../database/entities/expense-strategy-input.entity";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables if not already loaded
const env = process.env.APP_ENV || 'local';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

export const BillShareDataSource = new DataSource({
    type: "mysql",
    host: process.env.BILL_SHARE_DB_HOST || process.env.DB_HOST,
    port: parseInt(process.env.BILL_SHARE_DB_PORT || process.env.DB_PORT || "3306"),
    username: process.env.BILL_SHARE_DB_USERNAME || process.env.DB_USERNAME,
    password: process.env.BILL_SHARE_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.BILL_SHARE_DB_NAME || "billshare",
    synchronize: true,
    logging: true,
    entities: [User, ExpenseGroup, GroupMember, Expense, ExpenseSplit, ExpenseLog, ExpenseStrategyInput],
    migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
    subscribers: [],
});
