import { DataSource } from "typeorm";
import { ExpenseGroup } from "../database/entities/expense-group.entity";
import { GroupMember } from "../database/entities/group-member.entity";
import { Expense } from "../database/entities/expense.entity";
import { ExpenseSplit } from "../database/entities/expense-split.entity";
import * as dotenv from 'dotenv';

dotenv.config();

export const BillShareDataSource = new DataSource({
    type: "mysql",
    host: process.env.BILL_SHARE_DB_HOST || process.env.DB_HOST,
    port: parseInt(process.env.BILL_SHARE_DB_PORT || process.env.DB_PORT || "3306"),
    username: process.env.BILL_SHARE_DB_USERNAME || process.env.DB_USERNAME,
    password: process.env.BILL_SHARE_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.BILL_SHARE_DB_NAME || "bill_share_db",
    synchronize: false,
    logging: true,
    entities: [ExpenseGroup, GroupMember, Expense, ExpenseSplit],
    subscribers: [],
    migrations: [],
});
