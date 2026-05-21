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
import { ServiceTicketIncidenceType } from "../enums/service-tickets.enum";

@Entity({ name: "service_tickets_incidences" })
export class ServiceTicketIncidence {
  @PrimaryGeneratedColumn({ name: "tickin_id" })
  id!: number;

  @Column({ name: "tick_id", type: "int" })
  ticketId!: number;

  @Column({ name: "tick_type", type: "smallint" })
  type!: ServiceTicketIncidenceType;

  @Column({ name: "tick_description", type: "varchar", length: 255 })
  description!: string;

  @Column({ name: "tickin_created_by", type: "int", nullable: true })
  createdById!: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "tickin_created_by" })
  createdBy!: User | null;

  @CreateDateColumn({ name: "tick_created_at", type: "datetime" })
  createdAt!: Date;

  @ManyToOne(() => ServiceTicket, { nullable: false })
  @JoinColumn({ name: "tick_id", referencedColumnName: "id" })
  ticket!: ServiceTicket;
}
