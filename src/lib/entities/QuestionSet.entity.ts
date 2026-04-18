import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Question } from "./Question.entity";

@Entity("question_sets")
export class QuestionSet {
  @PrimaryGeneratedColumn({ name: "quese_id" })
  id!: number;

  @Column({ name: "quese_name", type: "varchar", length: 255 })
  name!: string;

  @Column({ name: "quese_description", type: "text", nullable: true })
  description!: string | null;

  @Column({ name: "quese_entity", type: "varchar", length: 50 })
  entity!: string;

  @Column({ name: "quese_entity_id", type: "int" })
  entityId!: number;

  @CreateDateColumn({ name: "quese_created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "quese_updated_at", type: "timestamp" })
  updatedAt!: Date;

  questions?: Question[];
}
