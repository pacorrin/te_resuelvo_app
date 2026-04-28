export interface MarkAsPaidDTO {
  processUuid: string;
  paymentReceiptNumber?: string;
  paymentTaxAmount?: number;
  paymentAmount?: number;
}