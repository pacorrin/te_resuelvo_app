import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddTicketsStatusHistory1778608187973 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "service_ticket_status_history",
                columns: [
                    new TableColumn({
                        name: "stsh_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    }),
                    new TableColumn({
                        name: "tick_id",
                        type: "int",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "stsh_status",
                        type: "smallint",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "stsh_event_type",
                        type: "smallint",
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: "stsh_changed_by",
                        type: "int",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "stsh_created_at",
                        type: "datetime",
                        default: "now()",
                    }),
                ],
                foreignKeys: [
                    {
                        name: "fk_stsh_ticket",
                        columnNames: ["tick_id"],
                        referencedColumnNames: ["tick_id"],
                        referencedTableName: "service_tickets",
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("service_ticket_status_history");
    }

}
