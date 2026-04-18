import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersMissedFields1771815994138 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users ADD phone varchar(20) NULL AFTER email`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
