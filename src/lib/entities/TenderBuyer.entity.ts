import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Organization } from "./Organization.entity";
import { User } from "./User.entity";
import { Tender } from "./Tender.entity";

@Entity("tenders_buyers")
export class TenderBuyer {
  @PrimaryGeneratedColumn({ name: "tendbu_id" })
  id!: number;

  @Column({ name: "tendbu_tender_id", type: "int" })
  tenderId!: number;

  @ManyToOne(() => Tender)
  @JoinColumn({ name: "tendbu_tender_id" })
  tender!: Tender;

  @Column({ name: "tendbu_organization_id", type: "int" })
  organizationId!: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "tendbu_organization_id" })
  organization!: Organization;

  @Column({ name: "tendbu_buyed_by", type: "int" })
  buyedBy!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "tendbu_buyed_by" })
  buyer!: User;

  @Column({
    name: "tendbu_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    name: "tendbu_payment_receipt_number",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  paymentReceiptNumber!: string | null;

  @Column({
    name: "tendbu_payment_status",
    type: "smallint",
    default: 1,
  })
  paymentStatus!: number;

  @Column({ name: "tendbu_payment_date", type: "datetime", nullable: true })
  paymentDate!: Date | null;

  @Column({
    name: "tendbu_payment_tax_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  paymentTaxAmount!: number | null;

  @Column({
    name: "tendbu_process_uuid",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  processUuid!: string | null;

  @CreateDateColumn({ name: "tendbu_created_at", type: "timestamp" })
  createdAt!: Date;
}
