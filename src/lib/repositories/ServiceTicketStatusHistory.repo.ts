import { getDataSource } from "@/src/lib/db/connection";
import type {
  CreateServiceTicketStatusHistoryInput,
  DeleteServiceTicketStatusHistoryInput,
  SearchServiceTicketStatusHistory,
} from "@/src/lib/dtos/ServiceTicketStatusHistory.dto";
import { ServiceTicketStatusHistory } from "@/src/lib/entities/ServiceTicketStatusHistory.entity";
import { Repository } from "typeorm";

export type {
  CreateServiceTicketStatusHistoryInput,
  SearchServiceTicketStatusHistory,
} from "@/src/lib/dtos/ServiceTicketStatusHistory.dto";

export class ServiceTicketStatusHistoryRepository {
  private static async getRepo(): Promise<Repository<ServiceTicketStatusHistory>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("ServiceTicketStatusHistory");
  }

  static async findOneBy(
    searchParams: SearchServiceTicketStatusHistory,
    relations: ("ticket" | "changedByUser")[] = [],
  ): Promise<ServiceTicketStatusHistory | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findAllByTicketId(
    ticketId: number,
    relations: ("ticket" | "changedByUser")[] = [],
  ): Promise<ServiceTicketStatusHistory[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ticketId },
      relations,
      order: { createdAt: "DESC" },
    });
  }

  static async create(
    data: CreateServiceTicketStatusHistoryInput,
  ): Promise<ServiceTicketStatusHistory> {
    const repo = await this.getRepo();
    const row = repo.create({
      ticketId: data.ticketId,
      status: data.status,
      changedBy: data.changedBy,
      eventType: data.eventType,
    });
    return repo.save(row);
  }

  static async deleteBy(searchParams: DeleteServiceTicketStatusHistoryInput): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete({ ...searchParams });
  }
}
