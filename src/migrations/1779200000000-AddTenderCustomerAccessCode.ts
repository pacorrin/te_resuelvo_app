import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTenderCustomerAccessCode1779200000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `tenders` ADD `tend_customer_access_code` varchar(6) NULL AFTER `tend_zipcode`",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `tenders` DROP COLUMN `tend_customer_access_code`",
    );
  }
}
