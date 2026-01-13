import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768000000000 implements MigrationInterface {
    name = 'InitialSchema1768000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Users Table
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL, 
                \`email\` varchar(255) NOT NULL, 
                \`name\` varchar(255) NOT NULL, 
                \`avatarUrl\` varchar(255) NULL, 
                \`firebaseUid\` varchar(255) NULL,
                \`isActive\` tinyint NOT NULL DEFAULT 1, 
                UNIQUE INDEX \`IDX_users_email\` (\`email\`), 
                UNIQUE INDEX \`IDX_users_firebaseUid\` (\`firebaseUid\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // 2. Apps Table (Including GlobalDefault columns)
        await queryRunner.query(`
            CREATE TABLE \`apps\` (
                \`id\` varchar(36) NOT NULL, 
                \`url\` varchar(255) NOT NULL, 
                \`category\` varchar(255) NOT NULL, 
                \`iconUrl\` varchar(255) NULL, 
                \`order\` int NOT NULL DEFAULT '0', 
                \`isGlobalDefault\` tinyint NOT NULL DEFAULT 0, 
                \`defaultSortOrder\` int NOT NULL DEFAULT 0,
                UNIQUE INDEX \`IDX_apps_url\` (\`url\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // 3. App Translations Table
        await queryRunner.query(`
            CREATE TABLE \`app_translations\` (
                \`id\` int NOT NULL AUTO_INCREMENT, 
                \`appId\` varchar(255) NOT NULL, 
                \`lang\` varchar(255) NOT NULL, 
                \`name\` varchar(255) NOT NULL, 
                \`description\` text NOT NULL, 
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_app_translations_appId\` FOREIGN KEY (\`appId\` ) REFERENCES \`apps\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);

        // 4. Workspaces Table
        await queryRunner.query(`
            CREATE TABLE \`workspaces\` (
                \`id\` int NOT NULL AUTO_INCREMENT, 
                \`userId\` varchar(255) NOT NULL, 
                \`name\` varchar(255) NOT NULL, 
                \`icon\` varchar(255) NULL, 
                \`order\` int NOT NULL DEFAULT '0', 
                \`isDefault\` tinyint NOT NULL DEFAULT 0, 
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_workspaces_userId\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);

        // 5. Workspace Apps Table
        await queryRunner.query(`
            CREATE TABLE \`workspace_apps\` (
                \`workspaceId\` int NOT NULL, 
                \`appId\` varchar(255) NOT NULL, 
                \`order\` int NOT NULL DEFAULT '0', 
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
                PRIMARY KEY (\`workspaceId\`, \`appId\`),
                CONSTRAINT \`FK_workspace_apps_workspaceId\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_workspace_apps_appId\` FOREIGN KEY (\`appId\`) REFERENCES \`apps\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);

        // 6. Workspace Templates Table
        await queryRunner.query(`
            CREATE TABLE \`workspace_templates\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`appIds\` json NOT NULL,
                \`icon\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // 7. Workspace Template Translations Table (New schema I found earlier)
        await queryRunner.query(`
             CREATE TABLE \`workspace_template_translations\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`workspaceTemplateId\` int NOT NULL,
                \`lang\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_wtt_templateId\` FOREIGN KEY (\`workspaceTemplateId\`) REFERENCES \`workspace_templates\`(\`id\`) ON DELETE CASCADE
             ) ENGINE=InnoDB
        `);

        // 8. Teamspaces Table
        await queryRunner.query(`
             CREATE TABLE \`teamspaces\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NULL,
                \`icon\` varchar(255) NULL,
                \`createdAt\` datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_teamspaces_userId\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
             ) ENGINE=InnoDB
        `);

        // 9. Teamspace Apps Table
        await queryRunner.query(`
            CREATE TABLE \`teamspace_apps\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`teamspaceId\` int NOT NULL,
                \`appId\` varchar(255) NOT NULL,
                \`order\` int NOT NULL DEFAULT 0,
                \`addedAt\` datetime DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`),
                CONSTRAINT \`FK_teamspace_apps_teamspaceId\` FOREIGN KEY (\`teamspaceId\`) REFERENCES \`teamspaces\`(\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_teamspace_apps_appId\` FOREIGN KEY (\`appId\`) REFERENCES \`apps\`(\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop in reverse order of dependencies
        await queryRunner.query(`DROP TABLE \`teamspace_apps\``);
        await queryRunner.query(`DROP TABLE \`teamspaces\``);
        await queryRunner.query(`DROP TABLE \`workspace_template_translations\``);
        await queryRunner.query(`DROP TABLE \`workspace_templates\``);
        await queryRunner.query(`DROP TABLE \`workspace_apps\``);
        await queryRunner.query(`DROP TABLE \`workspaces\``);
        await queryRunner.query(`DROP TABLE \`app_translations\``);
        await queryRunner.query(`DROP TABLE \`apps\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
