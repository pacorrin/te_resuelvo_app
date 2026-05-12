import type { CreateServiceTicketPaymentInput } from "@/src/lib/dtos/ServiceTicketPayment.dto";
import { ServiceTicketPayment } from "@/src/lib/entities/ServiceTicketPayment.entity";
import { ServiceTicketPaymentBalanceType } from "@/src/lib/enums/service-tickets.enum";
import { ServiceTicketPaymentRepository } from "@/src/lib/repositories/ServiceTicketPayment.repo";

export interface ServiceTicketPaymentDTO {
  id: number;
  ticketId: number;
  balanceType: ServiceTicketPaymentBalanceType;
  amount: number;
  description: string | null;
  createdAt: Date;
}

export class ServiceTicketPaymentService {
  static totalCredits(rows: ServiceTicketPaymentDTO[]): number {
    return rows
      .filter((r) => r.balanceType === ServiceTicketPaymentBalanceType.CREDIT)
      .reduce((sum, r) => sum + r.amount, 0);
  }

  static totalDebits(rows: ServiceTicketPaymentDTO[]): number {
    return rows
      .filter((r) => r.balanceType === ServiceTicketPaymentBalanceType.DEBIT)
      .reduce((sum, r) => sum + r.amount, 0);
  }

  /** Credits minus debits (positive means customer has paid more than charged). */
  static netBalance(rows: ServiceTicketPaymentDTO[]): number {
    return this.totalCredits(rows) - this.totalDebits(rows);
  }

  static serialize(row: ServiceTicketPayment): ServiceTicketPaymentDTO {
    return {
      id: row.id,
      ticketId: row.ticketId,
      balanceType: row.balanceType,
      amount: Number(row.amount),
      description: row.description,
      createdAt: row.createdAt,
    };
  }

  static async listByTicket(
    ticketId: number,
  ): Promise<ServiceTicketPaymentDTO[]> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return [];
    const rows = await ServiceTicketPaymentRepository.findAllByTicketId(
      ticketId,
      [],
    );
    return rows.map((r) => this.serialize(r));
  }

  static async create(
    ticketId: number,
    input: Omit<CreateServiceTicketPaymentInput, "ticketId">,
  ): Promise<ServiceTicketPaymentDTO | null> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return null;

    const row = await ServiceTicketPaymentRepository.create({
      ticketId,
      balanceType: input.balanceType,
      amount: input.amount,
      description: input.description ?? null,
    });
    return this.serialize(row);
  }
}
