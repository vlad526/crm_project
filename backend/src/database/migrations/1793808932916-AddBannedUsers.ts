import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBannedUsers1793808932916 implements MigrationInterface {
    name = 'AddBannedUsers1793808932916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isBanned\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isBanned\``);
    }

}
