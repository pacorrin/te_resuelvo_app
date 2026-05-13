import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { ServiceTicket } from "./ServiceTickets.entity";
import { User } from "./User.entity";
import { ServiceTicketStatus, ServiceTicketStatusHistoryEventType } from "../enums/service-tickets.enum";

@Entity({ name: "service_ticket_status_history" })
export class ServiceTicketStatusHistory {
  @PrimaryGeneratedColumn({ name: "stsh_id" })
  id!: number;

  @Column({ name: "tick_id", type: "int" })
  ticketId!: number;

  @Column({ name: "stsh_status", type: "smallint" })
  status!: ServiceTicketStatus;

  @Column({ name: "stsh_event_type", type: "smallint", nullable: true })
  eventType?: ServiceTicketStatusHistoryEventType | null;

  @Column({ name: "stsh_changed_by", type: "int" })
  changedBy!: number;

  @CreateDateColumn({ name: "stsh_created_at", type: "datetime" })
  createdAt!: Date;

  @ManyToOne(() => ServiceTicket, { nullable: false })
  @JoinColumn({ name: "tick_id", referencedColumnName: "id" })
  ticket!: ServiceTicket;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "stsh_changed_by", referencedColumnName: "id" })
  changedByUser!: User;
}
