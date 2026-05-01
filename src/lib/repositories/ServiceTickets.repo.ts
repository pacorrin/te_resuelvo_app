import { getDataSource } from "@/src/lib/db/connection";
import { ServiceTicket } from "@/src/lib/entities/ServiceTickets.entity";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import { Repository } from "typeorm";

export interface SearchServiceTicket {
  id?: number;
  tenderId?: number;
  organizationId?: number;
  status?: ServiceTicketStatus;
}

export interface CreateServiceTicketInput {
  tenderId: number;
  organizationId: number;
  status?: ServiceTicketStatus;
  serviceScheduledFor?: Date | null;
}

export interface UpdateServiceTicketInput {
  status?: ServiceTicketStatus;
  serviceScheduledFor?: Date | null;
}

export class ServiceTicketRepository {
  private static async getRepo(): Promise<Repository<ServiceTicket>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("ServiceTicket");
  }

  static async findOneBy(
    searchParams: SearchServiceTicket,
    relations: ("tender" | "organization" | "tender.service" | "tender.customer")[] = [],
  ): Promise<ServiceTicket | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findAll(
    searchParams: SearchServiceTicket = {},
    relations: ("tender" | "organization" | "tender.service" | "tender.customer")[] = [],
  ): Promise<ServiceTicket[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      relations,
      order: { id: "DESC" },
    });
  }

  static async create(data: CreateServiceTicketInput): Promise<ServiceTicket> {
    const repo = await this.getRepo();
    const row = repo.create({
      tenderId: data.tenderId,
      organizationId: data.organizationId,
      status: data.status ?? ServiceTicketStatus.OPEN,
      serviceScheduledFor: data.serviceScheduledFor ?? null,
    });
    return repo.save(row);
  }

  static async update(
    id: number,
    data: UpdateServiceTicketInput,
  ): Promise<ServiceTicket> {
    const repo = await this.getRepo();
    const existing = await this.findOneBy({ id });
    if (!existing) {
      throw new Error("Service ticket not found");
    }

    const patch: Partial<ServiceTicket> = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.serviceScheduledFor !== undefined) {
      patch.serviceScheduledFor = data.serviceScheduledFor;
    }

    return repo.save({ ...existing, ...patch });
  }
}
