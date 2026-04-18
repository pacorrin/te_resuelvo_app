import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddOrganizationsAndServices1770964391980 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "bussines_sector",
        columns: [
          {
            name: "bussec_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "bussec_name",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "bussec_description",
            type: "varchar",
            length: "300",
            isNullable: true,
          },
          {
            name: "bussec_icon",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "ser_show_in_public_page",
            type: "boolean",
            isNullable: false,
            default: 0,
          },
          {
            name: "bussec_created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    // 2. Services Table
    await queryRunner.createTable(
      new Table({
        name: "services",
        columns: [
          {
            name: "ser_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "ser_name",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "ser_lead_price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
            default: 0,
          },
          {
            name: "ser_description",
            type: "varchar",
            length: "300",
            isNullable: true,
          },
          {
            name: "ser_bussines_sector_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "ser_created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_services_bussines_sector",
            columnNames: ["ser_bussines_sector_id"],
            referencedColumnNames: ["bussec_id"],
            referencedTableName: "bussines_sector",
          }),
        ],
      }),
      true,
    );

    // 2. Organizations Table
    await queryRunner.createTable(
      new Table({
        name: "organizations",
        columns: [
          {
            name: "org_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "org_name",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "org_business_type",
            type: "smallint",
            isNullable: false,
            default: 1,
          },
          {
            name: "org_rfc",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "org_contact_email",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "org_phone",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "org_fiscal_address",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "org_description",
            type: "varchar",
            length: "1000",
            isNullable: true,
          },
          {
            name: "org_image",
            type: "varchar",
            length: "300",
            isNullable: true,
          },
          {
            name: "org_administrator_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "org_credits",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
            default: 0,
          },
          {
            name: "org_status",
            type: "smallint",
            isNullable: false,
            default: 1,
          },
          {
            name: "org_created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "org_updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_organizations_admin",
            columnNames: ["org_administrator_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "SET NULL",
          }),
        ],
      }),
      true,
    );

    // 3. Organization Members Table
    await queryRunner.createTable(
      new Table({
        name: "organization_members",
        columns: [
          {
            name: "ormem_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "ormem_organization_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "ormem_user_id",
            type: "int",
            isNullable: true,
          },
          {
            name: "ormem_user_email",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "ormem_role",
            type: "int",
            isNullable: false,
            default: 1,
          },
          {
            name: "ormem_is_invitation",
            type: "boolean",
            isNullable: false,
            default: false,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_ormem_org",
            columnNames: ["ormem_organization_id"],
            referencedColumnNames: ["org_id"],
            referencedTableName: "organizations",
          }),
          new TableForeignKey({
            name: "fk_ormem_user",
            columnNames: ["ormem_user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          }),
        ],
      }),
      true,
    );

    // 4. Organization Coverage Areas Table
    await queryRunner.createTable(
      new Table({
        name: "organization_coverage_areas",
        columns: [
          {
            name: "orcoar_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "orcoar_organization_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "orcoar_name",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "orcoar_latitude",
            type: "decimal",
            precision: 10,
            scale: 8,
            isNullable: false,
          },
          {
            name: "orcoar_longitude",
            type: "decimal",
            precision: 11,
            scale: 8,
            isNullable: false,
          },
          {
            name: "orcoar_radius_km",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: false,
          },
          {
            name: "orcoar_address",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "orcoar_created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_orcoar_org",
            columnNames: ["orcoar_organization_id"],
            referencedColumnNames: ["org_id"],
            referencedTableName: "organizations",
          }),
        ],
      }),
      true,
    );

    // 5. Organization Services (Correction: organization_services)
    await queryRunner.createTable(
      new Table({
        name: "organization_services",
        columns: [
          {
            name: "orser_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "orser_organization_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "ser_id",
            type: "int",
            isNullable: false,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_orser_org",
            columnNames: ["orser_organization_id"],
            referencedColumnNames: ["org_id"],
            referencedTableName: "organizations",
          }),
          new TableForeignKey({
            name: "fk_orser_service",
            columnNames: ["ser_id"],
            referencedColumnNames: ["ser_id"],
            referencedTableName: "services",
          }),
        ],
      }),
      true,
    );

    await queryRunner.addColumns("users", [
      new TableColumn({
        name: "image",
        type: "varchar",
        length: "255",
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // delete all records from this migration
    await queryRunner.query(`DELETE FROM organization_services`);
    await queryRunner.query(`DELETE FROM organization_coverage_areas`);
    await queryRunner.query(`DELETE FROM organization_members`);
    await queryRunner.query(`DELETE FROM organizations`);
    await queryRunner.query(`DELETE FROM services`);
    // delete added columns
    await queryRunner.dropColumn("users", "image");
    // Drop tables in reverse order to avoid FK constraints issues
    await queryRunner.dropTable("organization_services");
    await queryRunner.dropTable("organization_coverage_areas");
    await queryRunner.dropTable("organization_members");
    await queryRunner.dropTable("organizations");
    await queryRunner.dropTable("services");
  }
}
