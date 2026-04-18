import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";
import { OrganizationBusinessType } from "../enums/organizations.enum";

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn({ name: "org_id" })
  id!: number;

  @Column({ name: "org_name", type: "varchar", length: 150 })
  name!: string;

  @Column({ name: "org_business_type", type: "smallint" })
  businessType!: OrganizationBusinessType;

  @Column({ name: "org_rfc", type: "varchar", length: 20 })
  rfc!: string;

  @Column({ name: "org_contact_email", type: "varchar", length: 150 })
  contactEmail!: string;

  @Column({ name: "org_phone", type: "varchar", length: 20 })
  phone!: string;

  @Column({ name: "org_fiscal_address", type: "varchar", length: 255 })
  fiscalAddress!: string;

  @Column({
    name: "org_description",
    type: "varchar",
    length: 1000,
    nullable: true,
  })
  description?: string | null;

  @Column({ name: "org_image", type: "varchar", length: 300, nullable: true })
  image?: string | null;

  @Column({ name: "org_administrator_id", type: "int", nullable: true })
  administratorId?: number | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: "org_administrator_id" })
  administrator?: User | null;

  @Column({
    name: "org_credits",
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
  })
  credits!: number;

  @Column({ name: "org_status", type: "smallint", default: 1 })
  status!: number;

  @CreateDateColumn({ name: "org_created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "org_updated_at", type: "timestamp" })
  updatedAt!: Date;
}
