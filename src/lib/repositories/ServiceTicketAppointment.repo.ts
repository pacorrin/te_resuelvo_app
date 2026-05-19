import { getDataSource } from "@/src/lib/db/connection";
import { ServiceTicketAppointment } from "@/src/lib/entities/ServiceTicketAppointment.entity";
import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";
import { Repository } from "typeorm";

export interface CreateServiceTicketAppointmentInput {
  ticketId: number;
  description: string;
  scheduledAt: Date;
  attendingUserId: number;
  status?: ServiceTicketAppointmentStatus;
}

export interface UpdateServiceTicketAppointmentInput {
  description?: string;
  scheduledAt?: Date;
  attendingUserId?: number;
  status?: ServiceTicketAppointmentStatus;
}

export class ServiceTicketAppointmentRepository {
  private static async getRepo(): Promise<Repository<ServiceTicketAppointment>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository(ServiceTicketAppointment);
  }

  static async findAllByTicketId(
    ticketId: number,
    relations: ("attendingUser")[] = ["attendingUser"],
  ): Promise<ServiceTicketAppointment[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ticketId },
      relations,
      order: { scheduledAt: "ASC", id: "ASC" },
    });
  }

  static async countByTicketId(ticketId: number): Promise<number> {
    const repo = await this.getRepo();
    return repo.count({ where: { ticketId } });
  }

  static async findOneBy(
    id: number,
    ticketId: number,
    relations: ("attendingUser")[] = [],
  ): Promise<ServiceTicketAppointment | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { id, ticketId },
      relations,
    });
  }

  static async create(
    data: CreateServiceTicketAppointmentInput,
  ): Promise<ServiceTicketAppointment> {
    const repo = await this.getRepo();
    const row = repo.create({
      ticketId: data.ticketId,
      description: data.description,
      scheduledAt: data.scheduledAt,
      attendingUserId: data.attendingUserId,
      status: data.status ?? ServiceTicketAppointmentStatus.SCHEDULED,
    });
    return repo.save(row);
  }

  static async update(
    id: number,
    ticketId: number,
    data: UpdateServiceTicketAppointmentInput,
  ): Promise<ServiceTicketAppointment> {
    const repo = await this.getRepo();
    const existing = await this.findOneBy(id, ticketId, []);
    if (!existing) {
      throw new Error("Service ticket appointment not found");
    }
    if (data.description !== undefined) {
      existing.description = data.description;
    }
    if (data.scheduledAt !== undefined) {
      existing.scheduledAt = data.scheduledAt;
    }
    if (data.attendingUserId !== undefined) {
      existing.attendingUserId = data.attendingUserId;
    }
    if (data.status !== undefined) {
      existing.status = data.status;
    }
    return repo.save(existing);
  }

  static async deleteById(id: number, ticketId: number): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete({ id, ticketId });
  }

  static async deleteAllByTicketId(ticketId: number): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete({ ticketId });
  }
}
