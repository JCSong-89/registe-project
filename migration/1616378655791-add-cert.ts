import {MigrationInterface, QueryRunner} from "typeorm";

export class addCert1616378655791 implements MigrationInterface {
    name = 'addCert1616378655791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` ADD `cert` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `cert`");
    }

}
