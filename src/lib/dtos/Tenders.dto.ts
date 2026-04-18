import { TenderPaymentStatus } from "../enums/tender.enum";

/** Payload from the public form; server sets entity/entityId when persisting QuestionSetAnswer rows. */
export interface CreateTenderFromPublicSiteQuestionAnswerDTO {
  questionSetId: number;
  questionId: number;
  answer: string;
}

export interface CreateTenderDTO {
  serviceId: number;
  description: string;
  personName: string;
  personPhone: string;
  customerId: number;
  tenderAddress: string;
  tenderAddressReference?: string | null;
  longitude: string;
  latitude: string;
  zipcode: string;
}

export interface CreateTenderFromPublicSiteDTO {
  serviceId: number;
  description: string;
  personName: string;
  personPhone: string;
  email: string;
  customerId?: number;
  tenderAddress: string;
  tenderAddressReference?: string | null;
  longitude: string;
  latitude: string;
  zipcode: string;
  questionSetAnswers?: CreateTenderFromPublicSiteQuestionAnswerDTO[];
}

export interface SearchTender {
  id?: number;
  serviceId?: number;
  customerId?: number;
  zipcode?: string;
}

export interface SearchTenderBuyer {
  id?: number;
  tenderId?: number;
  organizationId?: number;
  buyedBy?: number;
  processUuid?: string;
}

export interface CreateTenderBuyerDTO {
  tenderId: number;
  organizationId: number;
  buyedBy: number;
  amount: number;
  paymentReceiptNumber?: string | null;
  paymentStatus?: TenderPaymentStatus;
  paymentDate?: Date | null;
  paymentTaxAmount?: number | string | null;
  processUuid?: string | null;
}

export interface SearchTendersNearbyByCoordinates {
  latitude: number;
  longitude: number;
}

export interface TenderDTO {
  id: number;
  serviceId: number;
  description: string;
  personName: string;
  personPhone: string;
  customerId: number;
  tenderAddress: string;
  tenderAddressReference?: string | null;
  longitude: string;
  latitude: string;
  zipcode: string;
  createdAt: Date;
}

/**
 * JSON-serializable tender row for Server Actions / client boundaries.
 * (TypeORM entities are class instances and must not cross the wire.)
 */
export interface TenderClientListDTO {
  id: number;
  serviceId: number;
  description: string;
  personName: string;
  personPhone: string;
  customerId: number;
  tenderAddress: string;
  tenderAddressReference?: string | null;
  longitude: string;
  latitude: string;
  zipcode: string;
  createdAt: string;
  service: {
    id: number;
    name: string;
    leadPrice: number;
  } | null;
  customer: {
    id: number;
    email: string;
    phone: string | null;
    name: string | null;
  } | null;
}

export interface InitPurchaseProcessDTO {
  tenderId: number;
  organizationId: number;
  buyedBy?: number;
}

export interface UpdatePaymentDTO {
  tenderBuyerId: number;
  paymentStatus: TenderPaymentStatus;
  paymentReceiptNumber?: string | null;
  paymentDate?: Date | null;
  paymentTaxAmount?: number | null;
  paymentAmount?: number | null;
}