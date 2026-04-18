import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { FileCategory, FileOwnerType } from "../storage/storage.enums";

@Entity("files")
export class FileEntity {
  @PrimaryGeneratedColumn({ name: "file_id" })
  id!: number;

  @Column({ name: "file_originalName", type: "varchar", length: 255 })
  originalName!: string;

  @Column({ name: "file_storedName", type: "varchar", length: 255 })
  storedName!: string;

  @Column({ name: "file_relativePath", type: "varchar", length: 255 })
  relativePath!: string;

  @Column({ name: "file_mimeType", type: "varchar", length: 100 })
  mimeType!: string;

  @Column({ name: "file_size", type: "bigint" })
  size!: string;

  @Column({ name: "file_category", type: "tinyint" })
  category!: FileCategory;

  @Column({ name: "file_ownerType", type: "tinyint" })
  ownerType!: FileOwnerType;

  @Column({ name: "file_ownerId", type: "int" })
  ownerId!: number;

  @Column({ name: "file_createdBy", type: "int", nullable: true })
  createdBy?: number | null;

  @CreateDateColumn({ name: "file_createdAt", type: "timestamp" })
  createdAt!: Date;
}
