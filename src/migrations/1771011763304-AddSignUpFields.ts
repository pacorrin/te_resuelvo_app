import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSignUpFields1771011763304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `users` ADD `signupHash` varchar(255) NULL DEFAULT NULL AFTER `verificationCode`",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `users` DROP COLUMN `signupHash` ");
  }
}
