import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddServiceTicketAppointments1779158392207
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "service_ticket_appointments",
        columns: [
          new TableColumn({
            name: "stap_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          }),
          new TableColumn({
            name: "stap_tick_id",
            type: "int",
            isNullable: false,
          }),
          new TableColumn({
            name: "stap_description",
            type: "varchar",
            length: "500",
            isNullable: false,
          }),
          new TableColumn({
            name: "stap_scheduled_at",
            type: "datetime",
            isNullable: false,
          }),
          new TableColumn({
            name: "stap_attending_user_id",
            type: "int",
            isNullable: false,
          }),
          new TableColumn({
            name: "stap_status",
            type: "smallint",
            isNullable: false,
            default: 1,
          }),
          new TableColumn({
            name: "stap_created_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          }),
        ],
        foreignKeys: [
          {
            name: "fk_stap_ticket",
            columnNames: ["stap_tick_id"],
            referencedColumnNames: ["tick_id"],
            referencedTableName: "service_tickets",
            onDelete: "CASCADE",
          },
          {
            name: "fk_stap_attending_user",
            columnNames: ["stap_attending_user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "RESTRICT",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("service_ticket_appointments");
  }
}
