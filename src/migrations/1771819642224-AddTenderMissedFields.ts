import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddTenderMissedFields1771819642224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `tenders` ADD `tend_service_id` int AFTER `tend_id`",
    );

    // create  FKs
    await queryRunner.createForeignKey(
      "tenders",
      new TableForeignKey({
        name: "fk_tenders_service",
        columnNames: ["tend_service_id"],
        referencedColumnNames: ["ser_id"],
        referencedTableName: "services",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop Fks
    await queryRunner.dropForeignKey("tenders", "fk_tenders_service");
  }
}
