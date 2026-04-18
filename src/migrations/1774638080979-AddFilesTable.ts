import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddFilesTable1774638080979 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "files",
                columns: [
                    {
                        name: "file_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "file_originalName",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "file_storedName",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "file_relativePath",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "file_mimeType",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "file_size",
                        type: "bigint",
                        isNullable: false,
                    },
                    {
                        name: "file_category",
                        type: "tinyint",
                        isNullable: false,
                    },
                    {
                        name: "file_ownerType",
                        type: "tinyint",
                        isNullable: false,
                    },
                    {
                        name: "file_ownerId",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "file_createdBy",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "file_createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("files");
    }

}
