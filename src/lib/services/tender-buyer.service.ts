import { InitPurchaseProcessDTO, UpdatePaymentDTO } from "../dtos/Tenders.dto";
import { TenderBuyer } from "../entities/TenderBuyer.entity";
import { TenderRepository } from "../repositories/Tender.repo";
import { TenderBuyerRepository } from "../repositories/TenderBuyer.repo";
import { auth } from "../auth/auth";
import { TenderPaymentStatus } from "../enums/tender.enum";
import { v7 as uuidv7 } from "uuid";

const TENDER_BUYER_SERIALIZE_RELATIONS: (
  | "buyer"
  | "tender"
  | "tender.service"
  | "tender.customer"
)[] = ["tender", "buyer", "tender.service", "tender.customer"];

export class TenderBuyerService {
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
          TENDER_BUYER_SERIALIZE_RELATIONS,
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
        TENDER_BUYER_SERIALIZE_RELATIONS,
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
        TENDER_BUYER_SERIALIZE_RELATIONS,
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


  static async getTenderBuyerByProcessUuid(processUuid: string): Promise<TenderBuyer> {
    const tenderBuyer = await TenderBuyerRepository.findOneBy(
      { processUuid },
      TENDER_BUYER_SERIALIZE_RELATIONS,
    );
    if (!tenderBuyer) {
      throw new Error("Tender buyer not found");
    }
    return this.serielizeTenderBuyer(tenderBuyer);
  }
}
