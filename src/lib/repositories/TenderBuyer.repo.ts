import { getDataSource } from "@/src/lib/db/connection";
import { TenderBuyer } from "@/src/lib/entities/TenderBuyer.entity";
import { Repository } from "typeorm";
import {
  CreateTenderBuyerDTO,
  SearchTenderBuyer,
} from "../dtos/Tenders.dto";

export class TenderBuyerRepository {
  private static async getRepo(): Promise<Repository<TenderBuyer>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("TenderBuyer");
  }

  static async findOneBy(
    searchParams: SearchTenderBuyer,
    relations: ("organization" | "buyer" | "tender" | "tender.service" |  "tender.customer")[] = [],
  ): Promise<TenderBuyer | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findByOrganization(
    organizationId: number,
    relations: ("buyer")[] = [],
  ): Promise<TenderBuyer[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { organizationId },
      relations,
    });
  }

  static async create(data: CreateTenderBuyerDTO): Promise<TenderBuyer> {
    const repo = await this.getRepo();
    const row = repo.create({
      tenderId: data.tenderId,
      organizationId: data.organizationId,
      buyedBy: data.buyedBy,
      amount: data.amount,
      paymentStatus: data.paymentStatus ?? 1,
      processUuid: data.processUuid ?? null,
    });
    return repo.save(row);
  }

  static async update(
    id: number,
    data: Partial<
      Pick<
        TenderBuyer,
        | "amount"
        | "paymentReceiptNumber"
        | "paymentStatus"
        | "paymentDate"
        | "paymentTaxAmount"
        | "processUuid"
        | "buyedBy"
      >
    >,
  ): Promise<TenderBuyer> {
    const repo = await this.getRepo();
    const existing = await this.findOneBy({ id });
    if (!existing) {
      throw new Error("Tender buyer row not found");
    }
    const patch: Partial<TenderBuyer> = { ...data };
    if (data.amount !== undefined) {
      patch.amount = data.amount;
    }
    if (data.paymentTaxAmount !== undefined) {
      patch.paymentTaxAmount = data.paymentTaxAmount != null ? data.paymentTaxAmount : null;
    }
    return repo.save({ ...existing, ...patch });
  }
}
