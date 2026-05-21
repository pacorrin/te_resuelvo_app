import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServiceTicketIncidenceCreatedBy1779200200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `service_tickets_incidences` ADD `tickin_created_by` int NULL AFTER `tick_description`",
    );
    await queryRunner.query(
      "ALTER TABLE `service_tickets_incidences` ADD CONSTRAINT `fk_tickin_created_by` FOREIGN KEY (`tickin_created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `service_tickets_incidences` DROP FOREIGN KEY `fk_tickin_created_by`",
    );
    await queryRunner.query(
      "ALTER TABLE `service_tickets_incidences` DROP COLUMN `tickin_created_by`",
    );
  }
}
