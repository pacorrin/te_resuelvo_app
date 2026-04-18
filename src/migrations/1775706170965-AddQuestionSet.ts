import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddQuestionSet1775706170965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "question_sets",
        columns: [
          {
            name: "quese_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "quese_name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "quese_description",
            type: "text",
            isNullable: true,
          },
          {
            name: "quese_entity",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "quese_entity_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quese_created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "quese_updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "questions",
        columns: [
          {
            name: "quest_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "quest_question_set_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quest_question_text",
            type: "text",
            isNullable: false,
          },
          {
            name: "quest_type",
            type: "tinyint",
            isNullable: false,
            comment: "e.g., 1: text, 2: multiple_choice, 3: single_choice, etc.",
          },
          {
            name: "quest_options",
            type: "text",
            isNullable: true,
            comment: "Options for 'multiple_choice' or 'single_choice' types, stored as JSON array"
          },
          {
            name: "quest_required",
            type: "boolean",
            isNullable: false,
            default: false,
          },
          {
            name: "quest_order",
            type: "int",
            isNullable: false,
            default: 0,
          },
          {
            name: "quest_created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "quest_updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
   
        foreignKeys: [
          {
            name: "fk_questions_question_set",
            columnNames: ["quest_question_set_id"],
            referencedTableName: "question_sets",
            referencedColumnNames: ["quese_id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "question_set_answers",
        columns: [
          {
            name: "quesa_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "quesa_question_set_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quesa_question_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quesa_answer",
            type: "text",
            isNullable: false,
          },
          {
            name: "quesa_entity",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "quesa_entity_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quesa_created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "quesa_updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            name: "fk_question_set_answers_question_set",
            columnNames: ["quesa_question_set_id"],
            referencedTableName: "question_sets",
            referencedColumnNames: ["quese_id"],
            onDelete: "CASCADE",
          },
          {
            name: "fk_question_set_answers_question",
            columnNames: ["quesa_question_id"],
            referencedTableName: "questions",
            referencedColumnNames: ["quest_id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to avoid FK constraints issues
    await queryRunner.dropTable("question_set_answers", true, true);
    await queryRunner.dropTable("questions", true, true);
    await queryRunner.dropTable("question_sets", true, true);
  }
}
