import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddProAndUserApps1768046157000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add isPro to users
        await queryRunner.addColumn("users", new TableColumn({
            name: "isPro",
            type: "boolean",
            default: false
        }));

        // Add userId to apps
        await queryRunner.addColumn("apps", new TableColumn({
            name: "userId",
            type: "varchar",
            length: "36",
            isNullable: true
        }));

        // Add FK
        await queryRunner.createForeignKey("apps", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("apps");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("userId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("apps", foreignKey);
            }
        }

        await queryRunner.dropColumn("apps", "userId");
        await queryRunner.dropColumn("users", "isPro");
    }

}
