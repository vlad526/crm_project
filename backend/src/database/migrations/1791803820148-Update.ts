import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1791803820148 implements MigrationInterface {
    name = 'Update1791803820148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_group\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_manager\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`created_at\` \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`alreadyPaid\` \`alreadyPaid\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`fk_orders_manager\` FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_77b9403790bf253dd71cfcdb6a4\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_77b9403790bf253dd71cfcdb6a4\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`fk_orders_manager\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`alreadyPaid\` \`alreadyPaid\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`created_at\` \`created_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_manager\` FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_group\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
