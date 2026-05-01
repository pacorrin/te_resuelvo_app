import { ServiceTicket } from "@/src/lib/entities/ServiceTickets.entity";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import {
  CreateServiceTicketInput,
  SearchServiceTicket,
  ServiceTicketRepository,
  UpdateServiceTicketInput,
} from "@/src/lib/repositories/ServiceTickets.repo";
import { TenderRepository } from "@/src/lib/repositories/Tender.repo";
import { TenderClientListDTO } from "../dtos/Tenders.dto";
import { TenderService } from "./tender.service";

const SERVICE_TICKET_RELATIONS: ("tender" | "organization" | "tender.service" | "tender.customer")[] = [
  "tender",
  "organization",
  "tender.service",
  "tender.customer",
];

export interface ServiceTicketDTO {
  id: number;
  tenderId: number;
  organizationId: number;
  status: ServiceTicketStatus;
  serviceScheduledFor: Date | null;
  createdAt: Date;
  tender: TenderClientListDTO | null;
}

export class ServiceTicketService {

  static serialize(serviceTicket: ServiceTicket): ServiceTicketDTO {
    return {
      id: serviceTicket.id,
      tenderId: serviceTicket.tenderId,
      organizationId: serviceTicket.organizationId,
      status: serviceTicket.status,
      serviceScheduledFor: serviceTicket.serviceScheduledFor,
      createdAt: serviceTicket.createdAt,
      tender: serviceTicket.tender
        ? TenderService.serializeTenderClientList(serviceTicket.tender)
        : null,
    };
  }

  static async getById(id: number): Promise<ServiceTicket | null> {
    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }
    return ServiceTicketRepository.findOneBy({ id }, SERVICE_TICKET_RELATIONS);
  }

  /** One ticket for this org, same relations/serialization as list. */
  static async getOneByOrganization(
    organizationId: number,
    ticketId: number,
  ): Promise<ServiceTicketDTO | null> {
    if (
      !Number.isFinite(organizationId) ||
      organizationId <= 0 ||
      !Number.isFinite(ticketId) ||
      ticketId <= 0
    ) {
      return null;
    }
    const row = await ServiceTicketRepository.findOneBy(
      { id: ticketId, organizationId },
      SERVICE_TICKET_RELATIONS,
    );
    if (!row) return null;
    return this.serialize(row);
  }

  static async getAllBy(
    searchParams: SearchServiceTicket = {},
  ): Promise<ServiceTicketDTO[]> {
    const serviceTickets = await ServiceTicketRepository.findAll(searchParams, SERVICE_TICKET_RELATIONS);
    return serviceTickets.map((serviceTicket) => this.serialize(serviceTicket));
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
