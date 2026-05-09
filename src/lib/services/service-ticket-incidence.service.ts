import type { CreateServiceTicketIncidenceInput } from "@/src/lib/dtos/ServiceTicketIncidence.dto";
import { ServiceTicketIncidence } from "@/src/lib/entities/ServiceTicketIncidence.entity";
import { ServiceTicketIncidenceType } from "@/src/lib/enums/service-tickets.enum";
import { ServiceTicketIncidenceRepository } from "@/src/lib/repositories/ServiceTicketIncidence.repo";

export interface ServiceTicketIncidenceDTO {
  id: number;
  ticketId: number;
  type: ServiceTicketIncidenceType;
  description: string;
  createdAt: Date;
}

export class ServiceTicketIncidenceService {
  static serialize(row: ServiceTicketIncidence): ServiceTicketIncidenceDTO {
    return {
      id: row.id,
      ticketId: row.ticketId,
      type: row.type,
      description: row.description,
      createdAt: row.createdAt,
    };
  }

  static async listByTicket(
    ticketId: number,
  ): Promise<ServiceTicketIncidenceDTO[]> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return [];
    const rows = await ServiceTicketIncidenceRepository.findAllByTicketId(
      ticketId,
      [],
    );
    return rows.map((r) => this.serialize(r));
  }

  static async create(
    ticketId: number,
    input: Omit<CreateServiceTicketIncidenceInput, "ticketId">,
  ): Promise<ServiceTicketIncidenceDTO | null> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return null;

    const row = await ServiceTicketIncidenceRepository.create({
      ticketId,
      type: input.type,
      description: input.description,
    });
    return this.serialize(row);
  }
}
