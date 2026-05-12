import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { ServiceTicket } from "./ServiceTickets.entity";
import { ServiceTicketPaymentBalanceType } from "../enums/service-tickets.enum";

@Entity({ name: "service_tickets_payments" })
export class ServiceTicketPayment {
  @PrimaryGeneratedColumn({ name: "tickpay_id" })
  id!: number;

  @Column({ name: "tick_id", type: "int" })
  ticketId!: number;

  @Column({ name: "tickpay_balance_type", type: "smallint" })
  balanceType!: ServiceTicketPaymentBalanceType;

  @Column({
    name: "tickpay_amount",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    name: "tickpay_description",
    type: "varchar",
    length: 150,
    nullable: true,
  })
  description!: string | null;

  @CreateDateColumn({ name: "tickpay_created_at", type: "datetime" })
  createdAt!: Date;

  @ManyToOne(() => ServiceTicket, { nullable: false })
  @JoinColumn({ name: "tick_id", referencedColumnName: "id" })
  ticket!: ServiceTicket;
}
