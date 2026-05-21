import { ServiceTicket } from "@/src/lib/entities/ServiceTickets.entity";
import {
  ServiceTicketStatus,
  ServiceTicketStatusHistoryEventType,
} from "@/src/lib/enums/service-tickets.enum";
import type { FileDTO } from "@/src/lib/dtos/File.dto";
import {
  CreateServiceTicketInput,
  SearchServiceTicket,
  ServiceTicketRepository,
  UpdateServiceTicketInput,
} from "@/src/lib/repositories/ServiceTickets.repo";
import { TenderRepository } from "@/src/lib/repositories/Tender.repo";
import {
  deleteLocalFileByRelativePath,
  saveRequestBodyToLocalFile,
} from "@/src/lib/storage/local-storage.service";
import { FileCategory, FileOwnerType } from "@/src/lib/storage/storage.enums";
import { TenderClientListDTO } from "../dtos/Tenders.dto";
import { FileService } from "./file.service";
import { OrganizationMemberService } from "./organization-member.service";
import { TenderService } from "./tender.service";
import { ServiceTicketStatusHistoryService } from "./service-ticket-status-history.service";
import { ServiceTicketAppointmentRepository } from "@/src/lib/repositories/ServiceTicketAppointment.repo";
import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";

export type ServiceTicketRelations =
  | "tender"
  | "organization"
  | "tender.service"
  | "tender.customer";
const SERVICE_TICKET_RELATIONS: ServiceTicketRelations[] = [
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

  static async getById(
    id: number,
    relations: ServiceTicketRelations[] = SERVICE_TICKET_RELATIONS,
  ): Promise<ServiceTicket | null> {
    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }
    return ServiceTicketRepository.findOneBy({ id }, relations);
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

  /** Ensures `userId` belongs to the organization that owns `ticketId`. */
  static async ensureUserMembershipForTicket(
    userId: number,
    ticketId: number,
    accessDeniedMessage = "No tienes acceso a este ticket.",
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { ok: false, error: "Identificador de ticket inválido." };
    }
    const ticket = await this.getById(ticketId, []);
    if (!ticket) {
      return { ok: false, error: "Ticket no encontrado." };
    }
    const belongs =
      await OrganizationMemberService.userBelongsToOrganization(
        userId,
        ticket.organizationId,
      );
    if (!belongs) {
      return { ok: false, error: accessDeniedMessage };
    }
    return { ok: true };
  }

  static async getAllBy(
    searchParams: SearchServiceTicket = {},
  ): Promise<ServiceTicketDTO[]> {
    const serviceTickets = await ServiceTicketRepository.findAll(
      searchParams,
      SERVICE_TICKET_RELATIONS,
    );
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
      status: data.status ?? ServiceTicketStatus.PENDING,
      serviceScheduledFor: data.serviceScheduledFor ?? null,
    });
  }

  static async update(
    id: number,
    data: UpdateServiceTicketInput,
  ): Promise<ServiceTicket> {
    return ServiceTicketRepository.update(id, data);
  }

  static async createStatusEventHistoryForStatus(
    id: number,
    status: ServiceTicketStatus,
    changedBy: number,
  ): Promise<void> {
    let statusToCreate: ServiceTicketStatusHistoryEventType[] = [];

    if (status === ServiceTicketStatus.CONTACTED) {
      statusToCreate = [ServiceTicketStatusHistoryEventType.FIRST_CONTACT];
    } else if (status === ServiceTicketStatus.QUOTED) {
      statusToCreate = [
        ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
        ServiceTicketStatusHistoryEventType.QUOTE_SENT,
      ];
    } else if (status === ServiceTicketStatus.IN_PROGRESS) {
      statusToCreate = [
        ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
        ServiceTicketStatusHistoryEventType.WORK_IN_PROGRESS,
      ];
    } else if (status === ServiceTicketStatus.COMPLETED) {
      statusToCreate = [
        ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
        ServiceTicketStatusHistoryEventType.WORK_IN_PROGRESS,
        ServiceTicketStatusHistoryEventType.WORK_COMPLETED,
      ];
    }

    await ServiceTicketStatusHistoryService.createStatusHistoryEvents(
      id,
      statusToCreate,
      status,
      changedBy,
    );
  }

  static async markStatus(
    id: number,
    status: ServiceTicketStatus,
    changedBy: number,
  ): Promise<ServiceTicket> {
    await this.createStatusEventHistoryForStatus(id, status, changedBy);
    return ServiceTicketRepository.update(id, { status });
  }

  static async setServiceScheduledFor(
    id: number,
    serviceScheduledFor: Date | null,
    changedBy: number,
  ): Promise<ServiceTicket> {
    const ticket = await this.getById(id, []);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (serviceScheduledFor) {
      await ServiceTicketStatusHistoryService.createStatusHistoryEvents(
        id,
        [
          ServiceTicketStatusHistoryEventType.VISIT_SCHEDULED,
          ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
        ],
        ticket.status,
        changedBy,
      );

      if (ticket.status === ServiceTicketStatus.PENDING) {
        return await this.update(id, {
          serviceScheduledFor,
          status: ServiceTicketStatus.CONTACTED,
        });
      }
    } else {
      await ServiceTicketStatusHistoryService.deleteStatusHistoryEvents([
        {
          ticketId: id,
          eventType: ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
        },
      ]);
    }

    return this.update(id, {
      serviceScheduledFor,
    });
  }

  static async markTicketVisitCompleted(
    ticketId: number,
    changedBy: number,
  ): Promise<ServiceTicket> {
    const ticket = await this.getById(ticketId, []);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const appointmentCount =
      await ServiceTicketAppointmentRepository.countByTicketId(ticketId);
    if (appointmentCount === 0 && !ticket.serviceScheduledFor) {
      throw new Error(
        "Debe haber una cita programada para marcar la visita como realizada.",
      );
    }
    const appointments =
      await ServiceTicketAppointmentRepository.findAllByTicketId(ticketId, []);
    const target =
      appointments.find(
        (r) => r.status === ServiceTicketAppointmentStatus.SCHEDULED,
      ) ?? appointments[0];
    if (!target) {
      throw new Error(
        "Debe haber una cita programada para marcar la visita como realizada.",
      );
    }
    const { ServiceTicketAppointmentService } = await import(
      "./service-ticket-appointment.service"
    );
    await ServiceTicketAppointmentService.markAsCompleted(
      ticketId,
      target.id,
      changedBy,
    );
    return ticket;
  }

  static async uploadQuote(ticketId: number, file: File): Promise<FileDTO> {
    const ticket = await ServiceTicketRepository.findOneBy(
      { id: ticketId },
      [],
    );
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const result = await saveRequestBodyToLocalFile({
      body: file.stream() as ReadableStream<Uint8Array>,
      fileName: file.name,
      folder: "service-tickets/quotes",
      contentType: file.type || "application/octet-stream",
      allowExtensions: [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "jpg",
        "jpeg",
        "png",
        "webp",
      ],
      fileMetadata: {
        category: FileCategory.DOCUMENT,
        ownerType: FileOwnerType.SERVICE_TICKET_QUOTE,
        ownerId: ticketId,
      },
    });

    if (result.fileId == null) {
      throw new Error("Failed to persist file record");
    }

    const dto = await FileService.getById(result.fileId);
    if (!dto) {
      throw new Error("File record missing");
    }
    return dto;
  }

  static async deleteQuote(ticketId: number, fileId: number): Promise<void> {
    const file = await FileService.getById(fileId);
    if (!file) {
      throw new Error("Archivo no encontrado.");
    }
    if (
      file.ownerType !== FileOwnerType.SERVICE_TICKET_QUOTE ||
      file.ownerId !== ticketId
    ) {
      throw new Error("El archivo no pertenece a las cotizaciones de este ticket.");
    }
    await deleteLocalFileByRelativePath(file.relativePath);
    await FileService.remove(fileId);
  }
}
