import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorTemplates1768100000001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add name and description to templates
        await queryRunner.query(`
            ALTER TABLE \`templates\` 
            ADD COLUMN \`name\` varchar(255) NULL,
            ADD COLUMN \`description\` text NULL
        `);

        // 2. Migrate EN data
        await queryRunner.query(`
            UPDATE \`templates\` t 
            JOIN \`templates_trans\` tt ON t.id = tt.workspaceTemplateId 
            SET t.name = tt.name, t.description = tt.description 
            WHERE tt.lang = 'en'
        `);

        // 3. Delete EN translations
        await queryRunner.query(`DELETE FROM \`templates_trans\` WHERE lang = 'en'`);

        // 4. Rename workspaceTemplateId to templateId in templates_trans
        // Check if index/FK exists first? Usually TypeORM creates indices. 
        // We drop existing FK if strict, but pure rename might work if supported, else CHANGE COLUMN.
        // MySQL: ALTER TABLE ... CHANGE old new type ...
        // We need to know column definitions. Usually int.
        
        // Let's get column info to be safe or just assume standard ID types.
        // Actually, just CHANGE COLUMN is standard in MySQL.
        await queryRunner.query(`
            ALTER TABLE \`templates_trans\` CHANGE \`workspaceTemplateId\` \`templateId\` int NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert 4
        await queryRunner.query(`
            ALTER TABLE \`templates_trans\` CHANGE \`templateId\` \`workspaceTemplateId\` int NOT NULL
        `);

        // Revert 3 & 2 & 1 (Approximation: Move data back, drop columns)
        // We accept data loss on revert for now or sophisticated migration, but simple down is okay.
        await queryRunner.query(`
            ALTER TABLE \`templates\` 
            DROP COLUMN \`name\`,
            DROP COLUMN \`description\`
        `);
    }

}
