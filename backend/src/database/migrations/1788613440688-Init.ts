import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1788613440688 implements MigrationInterface {
    name = 'Init1788613440688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`accessToken\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`accessTokenExpiresAt\` datetime(6) NOT NULL, \`refreshTokenExpiresAt\` datetime(6) NOT NULL, \`isBlocked\` tinyint NOT NULL DEFAULT 0, \`jti\` varchar(255) NOT NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_7d4251c84698d0633156759f5e\` (\`jti\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_664ea405ae2a10c264d582ee56\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comments\` (\`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`text\` text NOT NULL, \`order_id\` bigint NOT NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(25) NULL, \`surname\` varchar(25) NULL, \`email\` varchar(100) NULL, \`phone\` varchar(12) NULL, \`age\` int NULL, \`course\` varchar(10) NULL, \`course_format\` varchar(15) NULL, \`course_type\` varchar(100) NULL, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`status\` varchar(15) NULL, \`sum\` int NULL, \`alreadyPaid\` int NULL DEFAULT '0', \`utm\` varchar(100) NULL, \`msg\` varchar(100) NULL, \`manager_id\` int NULL, \`group_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`role\` enum ('manager', 'admin') NOT NULL DEFAULT 'manager', \`username\` varchar(25) NOT NULL, \`name\` varchar(25) NOT NULL, \`surname\` varchar(25) NOT NULL, \`avatarUrl\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`lastLogin\` timestamp NULL, \`actionToken\` varchar(255) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_d417e5d35f2434afc4bd48cb4d2\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_9bb41adf4431f6de42c79c4d305\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4c675567d2a58f0b07cef09c13d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`fk_orders_manager\` FOREIGN KEY (\`manager_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_77b9403790bf253dd71cfcdb6a4\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_77b9403790bf253dd71cfcdb6a4\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`fk_orders_manager\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4c675567d2a58f0b07cef09c13d\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_9bb41adf4431f6de42c79c4d305\``);
        await queryRunner.query(`ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_d417e5d35f2434afc4bd48cb4d2\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_664ea405ae2a10c264d582ee56\` ON \`groups\``);
        await queryRunner.query(`DROP TABLE \`groups\``);
        await queryRunner.query(`DROP INDEX \`IDX_7d4251c84698d0633156759f5e\` ON \`tokens\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }

}
