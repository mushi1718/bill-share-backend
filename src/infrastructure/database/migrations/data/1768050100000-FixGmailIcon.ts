
import { MigrationInterface, QueryRunner } from "typeorm";

export class FixGmailIcon1768050100000 implements MigrationInterface {
    name = 'FixGmailIcon1768050100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Revert Gmail to high-quality SVG
        const gmailIcon = 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg';
        await queryRunner.query(`UPDATE apps SET iconUrl = ? WHERE id = '4'`, [gmailIcon]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No rollback needed for cosmetic fix
    }
}
