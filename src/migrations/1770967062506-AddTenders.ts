import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class AddTenders1770967062506 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tenders Table
    await queryRunner.createTable(
      new Table({
        name: "tenders",
        columns: [
          {
            name: "tend_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "tend_description",
            type: "varchar",
            length: "400",
            isNullable: false,
          },
          {
            name: "tend_person_name",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "tend_person_phone",
            type: "varchar",
            length: "15",
            isNullable: false,
          },
          {
            name: "tend_customer_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "tend_tender_address",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "tend_tender_address_reference",
            type: "varchar",
            length: "200",
            isNullable: true,
          },
          {
            name: "tend_longitude",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "tend_latitude",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "tend_zipcode",
            type: "varchar",
            length: "10",
            isNullable: false,
          },
          {
            name: "tend_created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_tenders_customer",
            columnNames: ["tend_customer_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          }),
        ],
      }),
      true,
    );

    // 2. Tenders Buyers Table
    await queryRunner.createTable(
      new Table({
        name: "tenders_buyers",
        columns: [
          {
            name: "tendbu_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "tendbu_tender_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "tendbu_organization_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "tendbu_buyed_by",
            type: "int",
            isNullable: false,
          },
          {
            name: "tendbu_amount",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "tendbu_payment_receipt_number",
            type: "varchar",
            length: "25",
            isNullable: true,
          },
          {
            name: "tendbu_payment_status",
            type: "smallint",
            isNullable: false,
            default: 1,
          },
          {
            name: "tendbu_payment_date",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "tendbu_payment_tax_amount",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: "tendbu_process_uuid",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "tendbu_created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_tendbu_org",
            columnNames: ["tendbu_organization_id"],
            referencedColumnNames: ["org_id"],
            referencedTableName: "organizations",
          }),
          new TableForeignKey({
            name: "fk_tendbu_tender",
            columnNames: ["tendbu_tender_id"],
            referencedColumnNames: ["tend_id"],
            referencedTableName: "tenders",
          }),
          new TableForeignKey({
            name: "fk_tendbu_user",
            columnNames: ["tendbu_buyed_by"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          }),
        ],
      }),
      true,
    );

    // 3. Service Tickets Table
    await queryRunner.createTable(
      new Table({
        name: "service_tickets",
        columns: [
          {
            name: "tick_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "tick_tender_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "tick_organization_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "tick_status",
            type: "smallint",
            isNullable: false,
            default: 1,
          },
          {
            name: "tick_service_scheduled_for",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "tick_created_at",
            type: "datetime",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_tick_tender",
            columnNames: ["tick_tender_id"],
            referencedColumnNames: ["tend_id"],
            referencedTableName: "tenders",
          }),
          new TableForeignKey({
            name: "fk_tick_org",
            columnNames: ["tick_organization_id"],
            referencedColumnNames: ["org_id"],
            referencedTableName: "organizations",
          }),
        ],
      }),
      true,
    );

    // 4. Service Tickets Incidences Table
    await queryRunner.createTable(
      new Table({
        name: "service_tickets_incidences",
        columns: [
          {
            name: "tickin_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "tick_id", // Added FK to link to ticket
            type: "int",
            isNullable: false,
          },
          {
            name: "tick_type",
            type: "smallint",
            isNullable: false,
          },
          {
            name: "tick_description",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "tick_created_at",
            type: "datetime",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_tickin_ticket",
            columnNames: ["tick_id"],
            referencedColumnNames: ["tick_id"],
            referencedTableName: "service_tickets",
          }),
        ],
      }),
      true,
    );

    // 5. Service Tickets Payments Table
    await queryRunner.createTable(
      new Table({
        name: "service_tickets_payments",
        columns: [
          {
            name: "tickpay_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "tick_id", // Added FK to link to ticket
            type: "int",
            isNullable: false,
          },
          {
            name: "tickpay_amount",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "tickpay_description",
            type: "varchar",
            length: "150",
            isNullable: true,
          },
          {
            name: "tickpay_image",
            type: "varchar",
            length: "150",
            isNullable: true,
          },
          {
            name: "tickpay_created_at",
            type: "datetime",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_tickpay_ticket",
            columnNames: ["tick_id"],
            referencedColumnNames: ["tick_id"],
            referencedTableName: "service_tickets",
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // delete all records from this migration tables
    await queryRunner.query(`TRUNCATE TABLE service_tickets_payments`);
    await queryRunner.query(`TRUNCATE TABLE service_tickets_incidences`);
    await queryRunner.query(`TRUNCATE TABLE service_tickets`);
    await queryRunner.query(`TRUNCATE TABLE tenders_buyers`);
    await queryRunner.query(`TRUNCATE TABLE tenders`);

    // Drop tables in reverse order of creation
    await queryRunner.dropTable("service_tickets_payments");
    await queryRunner.dropTable("service_tickets_incidences");
    await queryRunner.dropTable("service_tickets");
    await queryRunner.dropTable("tenders_buyers");
    await queryRunner.dropTable("tenders");
  }
}
