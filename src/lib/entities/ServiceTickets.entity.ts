import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Tender } from "./Tender.entity";
import { Organization } from "./Organization.entity";
import { ServiceTicketStatus } from "../enums/service-tickets.enum";


@Entity({ name: "service_tickets" })
export class ServiceTicket {
  @PrimaryGeneratedColumn({ name: "tick_id" })
  id!: number;

  @Column({ name: "tick_tender_id", type: "int" })
  tenderId!: number;

  @Column({ name: "tick_organization_id", type: "int" })
  organizationId!: number;

  @Column({ name: "tick_status", type: "smallint", default: ServiceTicketStatus.OPEN })
  status!: ServiceTicketStatus;

  @Column({ name: "tick_service_scheduled_for", type: "datetime", nullable: true })
  serviceScheduledFor!: Date | null;

  @CreateDateColumn({ name: "tick_created_at", type: "datetime" })
  createdAt!: Date;

  @ManyToOne(() => Tender, { eager: false, nullable: false })
  @JoinColumn({ name: "tick_tender_id", referencedColumnName: "id" })
  tender!: Tender;

  @ManyToOne(() => Organization, { eager: false, nullable: false })
  @JoinColumn({ name: "tick_organization_id", referencedColumnName: "id" })
  organization!: Organization;
}