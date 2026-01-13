import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTurtleAppDescriptions1768200000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update Turtle Draw (English - Default)
        await queryRunner.query(`
            UPDATE apps 
            SET description = 'Life Utility' 
            WHERE name = 'Turtle Draw'
        `);

        // Update Turtle Shell (English - Default)
        await queryRunner.query(`
            UPDATE apps 
            SET description = 'Development Utility' 
            WHERE name = 'Turtle Shell'
        `);

        // Get App IDs
        const turtleDraw = await queryRunner.query(`SELECT id FROM apps WHERE name = 'Turtle Draw'`);
        const turtleShell = await queryRunner.query(`SELECT id FROM apps WHERE name = 'Turtle Shell'`);

        if (turtleDraw.length > 0) {
            const drawId = turtleDraw[0].id;
            
            // Turtle Draw Translations
            const drawTranslations = [
                { lang: 'zh-TW', desc: '生活小工具' },
                { lang: 'zh-CN', desc: '生活小工具' },
                { lang: 'ja', desc: '生活便利ツール' },
                { lang: 'ko', desc: '생활 도구' }
            ];

            for (const t of drawTranslations) {
                // Try to update existing translation
                const result = await queryRunner.query(`
                    UPDATE app_trans 
                    SET description = ? 
                    WHERE appId = ? AND lang = ?
                `, [t.desc, drawId, t.lang]);
            }
        }

        if (turtleShell.length > 0) {
            const shellId = turtleShell[0].id;
            
            // Turtle Shell Translations
            const shellTranslations = [
                { lang: 'zh-TW', desc: '開發小工具' },
                { lang: 'zh-CN', desc: '开发小工具' },
                { lang: 'ja', desc: '開発ツール' },
                { lang: 'ko', desc: '개발 도구' }
            ];

            for (const t of shellTranslations) {
                await queryRunner.query(`
                    UPDATE app_trans 
                    SET description = ? 
                    WHERE appId = ? AND lang = ?
                `, [t.desc, shellId, t.lang]);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverting text updates is usually not required unless purely strictly needed. 
    }
}
