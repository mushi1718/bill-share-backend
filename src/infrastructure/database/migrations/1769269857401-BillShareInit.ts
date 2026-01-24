import { MigrationInterface, QueryRunner } from "typeorm";

export class BillShareInit1769269857401 implements MigrationInterface {
    name = 'BillShareInit1769269857401'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`firebaseUid\` varchar(255) NULL, \`name\` varchar(255) NOT NULL, \`avatarUrl\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`preferences\` json NULL, \`isPro\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_e621f267079194e5428e19af2f\` (\`firebaseUid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`group_member\` (\`id\` varchar(36) NOT NULL, \`group_id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NULL, \`guest_name\` varchar(255) NULL, \`avatar_url\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expense_split\` (\`id\` varchar(36) NOT NULL, \`expense_id\` varchar(36) NOT NULL, \`member_id\` varchar(36) NOT NULL, \`amount\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expense\` (\`id\` varchar(36) NOT NULL, \`group_id\` varchar(36) NOT NULL, \`payer_member_id\` varchar(36) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`category\` varchar(20) NOT NULL DEFAULT 'GENERAL', \`description\` varchar(255) NOT NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`version\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expense_group\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`icon\` varchar(255) NOT NULL DEFAULT '💰', \`currency\` varchar(255) NOT NULL DEFAULT 'TWD', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`group_member\` ADD CONSTRAINT \`FK_e200cd6ff3e3903c5be5ae1400e\` FOREIGN KEY (\`group_id\`) REFERENCES \`expense_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense_split\` ADD CONSTRAINT \`FK_962af4c2f2eaddd6fbe70cd1f10\` FOREIGN KEY (\`expense_id\`) REFERENCES \`expense\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense_split\` ADD CONSTRAINT \`FK_5c825ae00eb214f3f2906a89888\` FOREIGN KEY (\`member_id\`) REFERENCES \`group_member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_b50aa03fde43af4d14eb84e6c2d\` FOREIGN KEY (\`group_id\`) REFERENCES \`expense_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_250f1558893d95dc9db247ab9a8\` FOREIGN KEY (\`payer_member_id\`) REFERENCES \`group_member\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_250f1558893d95dc9db247ab9a8\``);
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_b50aa03fde43af4d14eb84e6c2d\``);
        await queryRunner.query(`ALTER TABLE \`expense_split\` DROP FOREIGN KEY \`FK_5c825ae00eb214f3f2906a89888\``);
        await queryRunner.query(`ALTER TABLE \`expense_split\` DROP FOREIGN KEY \`FK_962af4c2f2eaddd6fbe70cd1f10\``);
        await queryRunner.query(`ALTER TABLE \`group_member\` DROP FOREIGN KEY \`FK_e200cd6ff3e3903c5be5ae1400e\``);
        await queryRunner.query(`DROP TABLE \`expense_group\``);
        await queryRunner.query(`DROP TABLE \`expense\``);
        await queryRunner.query(`DROP TABLE \`expense_split\``);
        await queryRunner.query(`DROP TABLE \`group_member\``);
        await queryRunner.query(`DROP INDEX \`IDX_e621f267079194e5428e19af2f\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
