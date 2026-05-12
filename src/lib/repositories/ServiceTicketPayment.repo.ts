import { getDataSource } from "@/src/lib/db/connection";
import type {
  CreateServiceTicketPaymentInput,
  SearchServiceTicketPayment,
} from "@/src/lib/dtos/ServiceTicketPayment.dto";
import { ServiceTicketPayment } from "@/src/lib/entities/ServiceTicketPayment.entity";
import { Repository } from "typeorm";

export type {
  CreateServiceTicketPaymentInput,
  SearchServiceTicketPayment,
} from "@/src/lib/dtos/ServiceTicketPayment.dto";

export class ServiceTicketPaymentRepository {
  private static async getRepo(): Promise<Repository<ServiceTicketPayment>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("ServiceTicketPayment");
  }

  static async findOneBy(
    searchParams: SearchServiceTicketPayment,
    relations: ("ticket")[] = [],
  ): Promise<ServiceTicketPayment | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findAllByTicketId(
    ticketId: number,
    relations: ("ticket")[] = [],
  ): Promise<ServiceTicketPayment[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ticketId },
      relations,
      order: { createdAt: "DESC" },
    });
  }

  static async create(
    data: CreateServiceTicketPaymentInput,
  ): Promise<ServiceTicketPayment> {
    const repo = await this.getRepo();
    const row = repo.create({
      ticketId: data.ticketId,
      balanceType: data.balanceType,
      amount: data.amount,
      description: data.description ?? null,
    });
    return repo.save(row);
  }
}
