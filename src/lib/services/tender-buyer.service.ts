import {
  InitPurchaseProcessDTO,
  UpdatePaymentDTO,
  type TenderClientListDTO,
} from "../dtos/Tenders.dto";
import { TenderBuyer } from "../entities/TenderBuyer.entity";
import { TenderRepository } from "../repositories/Tender.repo";
import { TenderBuyerRepository } from "../repositories/TenderBuyer.repo";
import { TenderService } from "./tender.service";
import { EmailService } from "./email.service";
import { getTenderNumber } from "../utils/tender.utils";
import { auth } from "../auth/auth";
import { getAppBaseUrl } from "../config/email.config";
import { TenderPaymentStatus } from "../enums/tender.enum";
import { v7 as uuidv7 } from "uuid";
import {
  MarkAsPaidDTO,
  type TenderBuyerClientDTO,
  type TenderBuyerInitProcessDTO,
  type TenderBuyerUserSummaryDTO,
} from "../dtos/TenderBuyer.dto";

const TENDER_BUYER_RELATIONS: (
  | "buyer"
  | "tender"
  | "tender.service"
  | "tender.customer"
)[] = ["tender", "buyer", "tender.service", "tender.customer"];

const TENDER_BUYER_EMAIL_RELATIONS: (
  | "buyer"
  | "tender"
  | "tender.service"
  | "tender.customer"
  | "organization"
)[] = [...TENDER_BUYER_RELATIONS, "organization"];

export class TenderBuyerService {
  static serializeInitProcess(
    tenderBuyer: TenderBuyer,
  ): TenderBuyerInitProcessDTO {
    const processUuid = tenderBuyer.processUuid?.trim();
    if (!processUuid) {
      throw new Error("processUuid missing on tender buyer");
    }
    return {
      id: tenderBuyer.id,
      processUuid,
    };
  }

  static serializeForClient(tenderBuyer: TenderBuyer): TenderBuyerClientDTO {
    return {
      id: tenderBuyer.id,
      tenderId: tenderBuyer.tenderId,
      organizationId: tenderBuyer.organizationId,
      buyedBy: tenderBuyer.buyedBy,
      amount: Number(tenderBuyer.amount),
      paymentReceiptNumber: tenderBuyer.paymentReceiptNumber,
      paymentStatus: tenderBuyer.paymentStatus,
      paymentDate:
        tenderBuyer.paymentDate instanceof Date
          ? tenderBuyer.paymentDate.toISOString()
          : tenderBuyer.paymentDate
            ? String(tenderBuyer.paymentDate)
            : null,
      paymentTaxAmount:
        tenderBuyer.paymentTaxAmount != null
          ? Number(tenderBuyer.paymentTaxAmount)
          : null,
      processUuid: tenderBuyer.processUuid,
      createdAt:
        tenderBuyer.createdAt instanceof Date
          ? tenderBuyer.createdAt.toISOString()
          : String(tenderBuyer.createdAt),
    };
  }

  static async serielizeTenderBuyer(
    tenderBuyer: TenderBuyer,
  ): Promise<TenderBuyer> {
    return {
      ...tenderBuyer,
      amount: Number(tenderBuyer.amount),
      paymentTaxAmount: Number(tenderBuyer.paymentTaxAmount),
      tender: {
        ...tenderBuyer.tender,
        service: {
          ...tenderBuyer.tender.service,
          leadPrice: Number(tenderBuyer.tender.service.leadPrice),
        },
        customer: {
          ...tenderBuyer.tender.customer
        },
      },
      buyer: {
        ...tenderBuyer.buyer,
        email: tenderBuyer.buyer.email,
        phone: tenderBuyer.buyer.phone ?? null,
        name: tenderBuyer.buyer.name ?? null,
      },
     
    };
  }
  static async initPurchaseProcess(
    data: InitPurchaseProcessDTO,
  ): Promise<TenderBuyer> {
    try {
      const tender = await TenderRepository.findOneBy({ id: data.tenderId });
      if (!tender) {
        throw new Error("Tender not found");
      }

      const existingTenderBuyer = await TenderBuyerRepository.findOneBy({
        tenderId: data.tenderId,
        organizationId: data.organizationId,
      });
      if (existingTenderBuyer) {
        await TenderBuyerRepository.update(existingTenderBuyer.id, {
          buyedBy: data.buyedBy,
        });
        const reloaded = await TenderBuyerRepository.findOneBy(
          { id: existingTenderBuyer.id },
          TENDER_BUYER_RELATIONS,
        );
        if (!reloaded) {
          throw new Error("Tender buyer not found after update");
        }
        return this.serielizeTenderBuyer(reloaded);
      }
      const created = await TenderBuyerRepository.create({
        tenderId: data.tenderId,
        organizationId: data.organizationId,
        buyedBy: data.buyedBy ?? 0,
        amount: 0,
        paymentStatus: TenderPaymentStatus.PENDING,
        processUuid: uuidv7(),
      });
      const tenderBuyer = await TenderBuyerRepository.findOneBy(
        { id: created.id },
        TENDER_BUYER_RELATIONS,
      );
      if (!tenderBuyer) {
        throw new Error("Tender buyer not found after create");
      }
      return this.serielizeTenderBuyer(tenderBuyer);
    } catch (error) {
      console.error("Error initializing purchase process:", error);
      throw error;
    }
  }

  static async updatePayment(data: UpdatePaymentDTO): Promise<TenderBuyer> {
    try {
      await TenderBuyerRepository.update(data.tenderBuyerId, data);
      const tenderBuyer = await TenderBuyerRepository.findOneBy(
        { id: data.tenderBuyerId },
        TENDER_BUYER_RELATIONS,
      );
      if (!tenderBuyer) {
        throw new Error("Tender buyer not found after payment update");
      }
      return this.serielizeTenderBuyer(tenderBuyer);
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  }

  static async markAsPaid(data: MarkAsPaidDTO): Promise<TenderBuyer> {
    const tenderBuyer = await this.getTenderBuyerByProcessUuid(data.processUuid);
    if (!tenderBuyer) {
      throw new Error("Tender buyer not found");
    }
    await TenderBuyerRepository.update(tenderBuyer.id, { 
      paymentStatus: TenderPaymentStatus.PAID, 
      paymentDate: new Date(Date.now()),
      paymentReceiptNumber: data.paymentReceiptNumber ?? null,
      paymentTaxAmount: data.paymentTaxAmount ?? null,
      amount: data.paymentAmount ?? 0,
    });
    const reloaded = await TenderBuyerRepository.findOneBy(
      { id: tenderBuyer.id },
      TENDER_BUYER_RELATIONS,
    );
    if (!reloaded) {
      throw new Error("Tender buyer not found after payment");
    }
    return this.serielizeTenderBuyer(reloaded);
  }

  /** Sends customer + buyer emails after a successful lead purchase. */
  static async notifyPurchaseCompleted(
    processUuid: string,
    ticketId: number,
  ): Promise<void> {
    if (!processUuid?.trim() || !Number.isFinite(ticketId) || ticketId <= 0) {
      return;
    }

    const tenderBuyer = await TenderBuyerRepository.findOneBy(
      { processUuid: processUuid.trim() },
      TENDER_BUYER_EMAIL_RELATIONS,
    );
    if (!tenderBuyer?.tender || tenderBuyer.paymentStatus !== TenderPaymentStatus.PAID) {
      return;
    }

    const tender = tenderBuyer.tender;
    const requestNumber = getTenderNumber(tender.id);
    const serviceName = tender.service?.name ?? "Servicio solicitado";
    const organizationName =
      tenderBuyer.organization?.name ?? "Proveedor asignado";
    const followUpUrl = `${getAppBaseUrl()}/provider-panel/leads/followup/${ticketId}`;

    const customerEmail = tender.customer?.email?.trim();
    if (customerEmail) {
      await EmailService.sendCustomerProviderAssigned({
        to: customerEmail,
        personName: tender.personName,
        requestNumber,
        serviceName,
        organizationName,
      });
    }

    const buyerEmail = tenderBuyer.buyer?.email?.trim();
    if (buyerEmail) {
      await EmailService.sendProviderTenderPurchased({
        to: buyerEmail,
        buyerName: tenderBuyer.buyer?.name ?? null,
        requestNumber,
        organizationName,
        serviceName,
        description: tender.description,
        personName: tender.personName,
        personPhone: tender.personPhone,
        address: tender.tenderAddress,
        zipcode: tender.zipcode,
        amountPaid: Number(tenderBuyer.amount),
        followUpUrl,
      });
    }
  }


  static serializeBuyerUserSummary(
    tenderBuyer: TenderBuyer,
  ): TenderBuyerUserSummaryDTO {
    const purchasedAt = tenderBuyer.paymentDate ?? tenderBuyer.createdAt;
    return {
      userId: tenderBuyer.buyedBy,
      name: tenderBuyer.buyer?.name ?? null,
      email: tenderBuyer.buyer?.email ?? "",
      phone: tenderBuyer.buyer?.phone ?? null,
      purchasedAt:
        purchasedAt instanceof Date
          ? purchasedAt.toISOString()
          : purchasedAt
            ? String(purchasedAt)
            : null,
    };
  }

  static async getBuyerUserSummaryForTenderAndOrganization(
    tenderId: number,
    organizationId: number,
  ): Promise<TenderBuyerUserSummaryDTO | null> {
    if (
      !Number.isFinite(tenderId) ||
      tenderId <= 0 ||
      !Number.isFinite(organizationId) ||
      organizationId <= 0
    ) {
      return null;
    }
    const tenderBuyer = await TenderBuyerRepository.findOneBy(
      { tenderId, organizationId },
      ["buyer"],
    );
    if (!tenderBuyer?.buyer) {
      return null;
    }
    return this.serializeBuyerUserSummary(tenderBuyer);
  }

  static async getTenderBuyerByProcessUuid(processUuid: string): Promise<TenderBuyer> {
    const tenderBuyer = await TenderBuyerRepository.findOneBy(
      { processUuid },
      TENDER_BUYER_RELATIONS,
    );
    if (!tenderBuyer) {
      throw new Error("Tender buyer not found");
    }
    return this.serielizeTenderBuyer(tenderBuyer);
  }

  static async getPaidTendersForOrganization(
    organizationId: number,
  ): Promise<TenderClientListDTO[]> {
    const rows =
      await TenderBuyerRepository.findPaidByOrganizationWithTenders(
        organizationId,
      );
    return rows
      .map((row) => row.tender)
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
      .map((t) => TenderService.serializeTenderClientList(t));
  }
}
