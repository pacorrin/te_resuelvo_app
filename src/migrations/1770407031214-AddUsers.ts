import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddUsers1770407031214 implements MigrationInterface {
  name = "AddUsers1770407031214";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "passwordHash",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "userType",
            type: "smallint",
            isNullable: false,
          },
          {
            name: "isVerified",
            type: "boolean",
            isNullable: false,
            default: false,
          },
          {
            name: "verificationCode",
            type: "varchar",
            length: "6",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "datetime",
            precision: 6,
            default: "CURRENT_TIMESTAMP(6)",
          },
          {
            name: "updatedAt",
            type: "datetime",
            precision: 6,
            default: "CURRENT_TIMESTAMP(6)",
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
