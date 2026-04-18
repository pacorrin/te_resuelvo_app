import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("question_set_answers")
export class QuestionSetAnswer {
  @PrimaryGeneratedColumn({ name: "quesa_id" })
  id!: number;

  @Column({ name: "quesa_question_set_id", type: "int" })
  questionSetId!: number;

  @Column({ name: "quesa_question_id", type: "int" })
  questionId!: number;

  @Column({ name: "quesa_answer", type: "text" })
  answer!: string;

  @Column({ name: "quesa_entity", type: "varchar", length: 50 })
  relatedEntity!: string;

  @Column({ name: "quesa_entity_id", type: "int" })
  relatedEntityId!: number;

  @CreateDateColumn({ name: "quesa_created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "quesa_updated_at", type: "timestamp" })
  updatedAt!: Date;
}
