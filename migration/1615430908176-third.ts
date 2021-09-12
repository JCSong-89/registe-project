import {MigrationInterface, QueryRunner} from "typeorm";

export class third1615430908176 implements MigrationInterface {
    name = 'third1615430908176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `news` ADD `content` longtext NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `news` DROP COLUMN `content`");
    }

}
