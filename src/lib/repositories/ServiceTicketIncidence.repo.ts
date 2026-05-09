import { getDataSource } from "@/src/lib/db/connection";
import type {
  CreateServiceTicketIncidenceInput,
  SearchServiceTicketIncidence,
} from "@/src/lib/dtos/ServiceTicketIncidence.dto";
import { ServiceTicketIncidence } from "@/src/lib/entities/ServiceTicketIncidence.entity";
import { Repository } from "typeorm";

export type {
  CreateServiceTicketIncidenceInput,
  SearchServiceTicketIncidence,
} from "@/src/lib/dtos/ServiceTicketIncidence.dto";

export class ServiceTicketIncidenceRepository {
  private static async getRepo(): Promise<Repository<ServiceTicketIncidence>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("ServiceTicketIncidence");
  }

  static async findOneBy(
    searchParams: SearchServiceTicketIncidence,
    relations: ("ticket")[] = [],
  ): Promise<ServiceTicketIncidence | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findAllByTicketId(
    ticketId: number,
    relations: ("ticket")[] = [],
  ): Promise<ServiceTicketIncidence[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ticketId },
      relations,
      order: { createdAt: "DESC" },
    });
  }

  static async create(
    data: CreateServiceTicketIncidenceInput,
  ): Promise<ServiceTicketIncidence> {
    const repo = await this.getRepo();
    const row = repo.create({
      ticketId: data.ticketId,
      type: data.type,
      description: data.description,
    });
    return repo.save(row);
  }
}
