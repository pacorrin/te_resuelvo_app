import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";
import { ServiceTicket } from "./ServiceTickets.entity";
import { User } from "./User.entity";

@Entity({ name: "service_ticket_appointments" })
export class ServiceTicketAppointment {
  @PrimaryGeneratedColumn({ name: "stap_id" })
  id!: number;

  @Column({ name: "stap_tick_id", type: "int" })
  ticketId!: number;

  @Column({ name: "stap_description", type: "varchar", length: 500 })
  description!: string;

  @Column({ name: "stap_scheduled_at", type: "datetime" })
  scheduledAt!: Date;

  @Column({ name: "stap_attending_user_id", type: "int" })
  attendingUserId!: number;

  @Column({
    name: "stap_status",
    type: "smallint",
    default: ServiceTicketAppointmentStatus.SCHEDULED,
  })
  status!: ServiceTicketAppointmentStatus;

  @CreateDateColumn({ name: "stap_created_at", type: "datetime" })
  createdAt!: Date;

  @ManyToOne(() => ServiceTicket, { nullable: false })
  @JoinColumn({ name: "stap_tick_id", referencedColumnName: "id" })
  ticket!: ServiceTicket;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "stap_attending_user_id", referencedColumnName: "id" })
  attendingUser!: User;
}
