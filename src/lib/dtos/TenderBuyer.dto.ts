export interface MarkAsPaidDTO {
  processUuid: string;
  paymentReceiptNumber?: string;
  paymentTaxAmount?: number;
  paymentAmount?: number;
}

/** Returned when starting checkout from the provider panel. */
export interface TenderBuyerInitProcessDTO {
  id: number;
  processUuid: string;
}

/** Plain tender-buyer fields safe to pass through server actions. */
export interface TenderBuyerClientDTO {
  id: number;
  tenderId: number;
  organizationId: number;
  buyedBy: number;
  amount: number;
  paymentReceiptNumber: string | null;
  paymentStatus: number;
  paymentDate: string | null;
  paymentTaxAmount: number | null;
  processUuid: string | null;
  createdAt: string;
}

/** Provider user who purchased the tender (TenderBuyer.buyer). */
export interface TenderBuyerUserSummaryDTO {
  userId: number;
  name: string | null;
  email: string;
  phone: string | null;
  purchasedAt: string | null;
}