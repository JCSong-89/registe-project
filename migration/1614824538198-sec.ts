import {MigrationInterface, QueryRunner} from "typeorm";

export class sec1614824538198 implements MigrationInterface {
    name = 'sec1614824538198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` ADD `telephone` text NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `accounts` DROP COLUMN `telephone`");
    }

}
