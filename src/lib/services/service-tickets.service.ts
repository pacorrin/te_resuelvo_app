import { ServiceTicket } from "@/src/lib/entities/ServiceTickets.entity";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import {
  CreateServiceTicketInput,
  SearchServiceTicket,
  ServiceTicketRepository,
  UpdateServiceTicketInput,
} from "@/src/lib/repositories/ServiceTickets.repo";
import { TenderRepository } from "@/src/lib/repositories/Tender.repo";

const SERVICE_TICKET_RELATIONS: ("tender" | "organization")[] = [
  "tender",
  "organization",
];

export class ServiceTicketService {
  static async getById(id: number): Promise<ServiceTicket | null> {
    return ServiceTicketRepository.findOneBy({ id }, SERVICE_TICKET_RELATIONS);
  }

  static async getAll(
    searchParams: SearchServiceTicket = {},
  ): Promise<ServiceTicket[]> {
    return ServiceTicketRepository.findAll(searchParams, SERVICE_TICKET_RELATIONS);
  }

  static async create(data: CreateServiceTicketInput): Promise<ServiceTicket> {
    const tender = await TenderRepository.findOneBy({ id: data.tenderId });
    if (!tender) {
      throw new Error("Tender not found");
    }

    const existing = await ServiceTicketRepository.findOneBy({
      tenderId: data.tenderId,
      organizationId: data.organizationId,
    });
    if (existing) {
      return ServiceTicketRepository.update(existing.id, {
        status: data.status ?? existing.status,
        serviceScheduledFor:
          data.serviceScheduledFor !== undefined
            ? data.serviceScheduledFor
            : existing.serviceScheduledFor,
      });
    }

    return ServiceTicketRepository.create({
      tenderId: data.tenderId,
      organizationId: data.organizationId,
      status: data.status ?? ServiceTicketStatus.OPEN,
      serviceScheduledFor: data.serviceScheduledFor ?? null,
    });
  }

  static async update(
    id: number,
    data: UpdateServiceTicketInput,
  ): Promise<ServiceTicket> {
    return ServiceTicketRepository.update(id, data);
  }

  static async markStatus(
    id: number,
    status: ServiceTicketStatus,
  ): Promise<ServiceTicket> {
    return ServiceTicketRepository.update(id, { status });
  }
}
