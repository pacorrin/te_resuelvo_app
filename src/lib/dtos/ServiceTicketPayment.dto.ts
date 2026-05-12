import type { ServiceTicketPaymentBalanceType } from "@/src/lib/enums/service-tickets.enum";

export interface SearchServiceTicketPayment {
  id?: number;
  ticketId?: number;
}

export interface CreateServiceTicketPaymentInput {
  ticketId: number;
  balanceType: ServiceTicketPaymentBalanceType;
  amount: number;
  description?: string | null;
}
