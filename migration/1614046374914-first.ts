import { MigrationInterface, QueryRunner } from 'typeorm';

export class first1614046374914 implements MigrationInterface {
  name = 'first1614046374914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `announcements` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `top` tinyint NOT NULL DEFAULT 0, `title` text NOT NULL, `content` longtext NOT NULL, `idx` int NOT NULL AUTO_INCREMENT, `accountId` varchar(36) NULL, UNIQUE INDEX `IDX_9087e9bb603bf35adf4c78253d` (`idx`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `accounts` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `email` varchar(255) NOT NULL, `password` text NOT NULL, `specialPoint` longtext NULL, `staffLevel` text NULL, `name` text NOT NULL, `group` text NOT NULL, `lastLoginDate` datetime NULL, `lastLoginIP` varchar(255) NULL, UNIQUE INDEX `IDX_ee66de6cdc53993296d1ceb8aa` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `registeProjects` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `email` text NOT NULL, `CEOName` text NOT NULL, `telephone` text NOT NULL, `company` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `files` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `url` text NOT NULL, `filename` text NOT NULL, `blobname` text NOT NULL, `type` text NOT NULL, `category` enum ('announcement', 'gallery', 'registeProject') NULL, `fkId` text NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `galleries` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `top` tinyint NOT NULL DEFAULT 0, `title` text NOT NULL, `content` text NOT NULL, `startedAt` datetime NOT NULL, `finishedAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `news` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `top` tinyint NOT NULL DEFAULT 0, `media` text NOT NULL, `title` text NOT NULL, `url` text NOT NULL, `reportDate` datetime NOT NULL, `idx` int NOT NULL AUTO_INCREMENT, UNIQUE INDEX `IDX_ec01a7a66ad262857018e06f6e` (`idx`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `announcements` ADD CONSTRAINT `FK_8b1504664b71f39ae0162cbcbed` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      "INSERT INTO `accounts` (`id`, `createdAt`, `updatedAt`, `email`, `password`, `specialPoint`, `staffLevel`, `name`, `group`) VALUES ('d76ed4b9-0de4-4793-b428-6579e5047ac3', '2021-02-23 11:08:00.511995', '2021-02-23 11:08:00.511995', 'admin@registe.com', '$2b$10$OWsKAbon8WEaC568Xs2tie6UjfIkpoJAw65/.HxG.zeRw6BvlbO0C', '기본생성관리자계정', '관리자', '관리자', '주식회사')",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `announcements` DROP FOREIGN KEY `FK_8b1504664b71f39ae0162cbcbed`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_ec01a7a66ad262857018e06f6e` ON `news`',
    );
    await queryRunner.query('DROP TABLE `news`');
    await queryRunner.query('DROP TABLE `galleries`');
    await queryRunner.query('DROP TABLE `files`');
    await queryRunner.query('DROP TABLE `registeProjects`');
    await queryRunner.query(
      'DROP INDEX `IDX_ee66de6cdc53993296d1ceb8aa` ON `accounts`',
    );
    await queryRunner.query('DROP TABLE `accounts`');
    await queryRunner.query(
      'DROP INDEX `IDX_9087e9bb603bf35adf4c78253d` ON `announcements`',
    );
    await queryRunner.query('DROP TABLE `announcements`');
  }
}
