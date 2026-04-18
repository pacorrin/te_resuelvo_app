import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("services")
export class Service {
  @PrimaryGeneratedColumn({ name: "ser_id" })
  id!: number;

  @Column({ name: "ser_name", type: "varchar", length: 150 })
  name!: string;

  @Column({
    name: "ser_lead_price",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  leadPrice!: number;

  @Column({
    name: "ser_description",
    type: "varchar",
    length: 300,
    nullable: true,
  })
  description?: string | null;

  @Column({ name: "ser_bussines_sector_id" })
  businessSectorId!: number;

  @CreateDateColumn({ name: "ser_created_at", type: "timestamp" })
  createdAt!: Date;
}
