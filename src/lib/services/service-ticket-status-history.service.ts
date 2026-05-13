import type {
  CreateServiceTicketStatusHistoryInput,
  DeleteServiceTicketStatusHistoryInput,
  ServiceTicketStatusHistoryDTO,
} from "@/src/lib/dtos/ServiceTicketStatusHistory.dto";
import { ServiceTicketStatusHistory } from "@/src/lib/entities/ServiceTicketStatusHistory.entity";
import { ServiceTicketStatusHistoryRepository } from "@/src/lib/repositories/ServiceTicketStatusHistory.repo";
import { ServiceTicketStatus, ServiceTicketStatusHistoryEventType } from "../enums/service-tickets.enum";

export class ServiceTicketStatusHistoryService {
  static serialize(row: ServiceTicketStatusHistory): ServiceTicketStatusHistoryDTO {
    return {
      id: row.id,
      ticketId: row.ticketId,
      status: row.status,
      eventType: row.eventType ?? null,
      changedBy: row.changedBy,
      createdAt: row.createdAt,
    };
  }

  static async listByTicket(
    ticketId: number,
    withChangedByUser = false,
  ): Promise<ServiceTicketStatusHistoryDTO[]> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return [];
    const relations: ("ticket" | "changedByUser")[] = withChangedByUser
      ? ["changedByUser"]
      : [];
    const rows = await ServiceTicketStatusHistoryRepository.findAllByTicketId(
      ticketId,
      relations,
    );
    return rows.map((r) => this.serialize(r));
  }

  static async create(
    data: CreateServiceTicketStatusHistoryInput,
  ): Promise<ServiceTicketStatusHistoryDTO | null> {
    if (
      !Number.isFinite(data.ticketId) ||
      data.ticketId <= 0 ||
      !Number.isFinite(data.changedBy) ||
      data.changedBy <= 0
    ) {
      throw new Error("Invalid data for creating service ticket status history");
    }

    if (data.eventType) {
      const existing = await ServiceTicketStatusHistoryRepository.findOneBy({
        ticketId: data.ticketId,
        eventType: data.eventType,
      });
      if (!existing) {
        const row = await ServiceTicketStatusHistoryRepository.create(data);
        return this.serialize(row);
      }else{
        return this.serialize(existing);
      }
    }

    return null;
  }

  static async createStatusHistoryEvents(
    id: number,
    eventsToCreate: ServiceTicketStatusHistoryEventType[],
    status: ServiceTicketStatus,
    changedBy: number,
  ): Promise<void> {
    for (const statusToCreateItem of eventsToCreate) {
      if (statusToCreateItem != null) {
        await ServiceTicketStatusHistoryService.create({
          ticketId: id,
          status,
          eventType: statusToCreateItem,
          changedBy,
        });
      }
    }
  }

  static async deleteStatusHistoryEvents(
    data: DeleteServiceTicketStatusHistoryInput | DeleteServiceTicketStatusHistoryInput[],
  ): Promise<void> {
    if (Array.isArray(data)) {
      for (const entry of data) {
        await ServiceTicketStatusHistoryRepository.deleteBy(entry);
      }
    } else {
      await ServiceTicketStatusHistoryRepository.deleteBy(data);
    }
  }

  
}
