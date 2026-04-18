import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { QuestionSet } from "./QuestionSet.entity";

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn({ name: "quest_id" })
  id!: number;

  @Column({ name: "quest_question_set_id", type: "int" })
  questionSetId!: number;

  @ManyToOne(() => QuestionSet)
  @JoinColumn({ name: "quest_question_set_id" })
  questionSet!: QuestionSet;

  @Column({ name: "quest_question_text", type: "text" })
  questionText!: string;

  @Column({ name: "quest_type", type: "varchar", length: 50 })
  questionType!: string;

  @Column({ name: "quest_options", type: "text", nullable: true })
  options!: string | null;

  @Column({ name: "quest_required", type: "boolean", default: false })
  required!: boolean;

  @Column({ name: "quest_order", type: "int", default: 0 })
  sortOrder!: number;

  @CreateDateColumn({ name: "quest_created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "quest_updated_at", type: "timestamp" })
  updatedAt!: Date;
}
