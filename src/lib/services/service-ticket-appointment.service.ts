import type { CreateServiceTicketAppointmentInput } from "@/src/lib/dtos/ServiceTicketAppointment.dto";
import type { ServiceTicketAppointmentDTO } from "@/src/lib/dtos/ServiceTicketAppointment.dto";
import { ServiceTicketAppointment } from "@/src/lib/entities/ServiceTicketAppointment.entity";
import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import { ServiceTicketStatusHistoryEventType } from "@/src/lib/enums/service-tickets.enum";
import { OrganizationMemberRepository } from "@/src/lib/repositories/OrganizationMember.repo";
import { ServiceTicketAppointmentRepository } from "@/src/lib/repositories/ServiceTicketAppointment.repo";
import { OrganizationMemberService } from "./organization-member.service";
import { ServiceTicketService } from "./service-tickets.service";
import { ServiceTicketStatusHistoryService } from "./service-ticket-status-history.service";

export class ServiceTicketAppointmentService {
  static serialize(row: ServiceTicketAppointment): ServiceTicketAppointmentDTO {
    return {
      id: row.id,
      ticketId: row.ticketId,
      description: row.description,
      scheduledAt: row.scheduledAt,
      attendingUserId: row.attendingUserId,
      attendingUserName: row.attendingUser?.name ?? null,
      status: row.status,
      createdAt: row.createdAt,
    };
  }

  static async listByTicket(
    ticketId: number,
  ): Promise<ServiceTicketAppointmentDTO[]> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return [];
    const rows = await ServiceTicketAppointmentRepository.findAllByTicketId(
      ticketId,
      ["attendingUser"],
    );
    return rows.map((r) => this.serialize(r));
  }

  static async create(
    ticketId: number,
    input: CreateServiceTicketAppointmentInput,
    changedBy: number,
  ): Promise<ServiceTicketAppointmentDTO | null> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return null;

    const description = String(input.description ?? "").trim();
    if (!description) {
      throw new Error("La descripción de la cita es obligatoria.");
    }

    const attendingUserId = Number(input.attendingUserId);
    if (!Number.isFinite(attendingUserId) || attendingUserId <= 0) {
      throw new Error("Selecciona un miembro que atenderá la cita.");
    }

    const scheduledAt = new Date(input.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new Error("Fecha u hora inválida.");
    }

    const ticket = await ServiceTicketService.getById(ticketId, []);
    if (!ticket) {
      throw new Error("Ticket no encontrado.");
    }

    const isOrgMember = await OrganizationMemberService.userBelongsToOrganization(
      attendingUserId,
      ticket.organizationId,
    );
    if (!isOrgMember) {
      throw new Error("El miembro seleccionado no pertenece a la organización.");
    }

    const existingCount =
      await ServiceTicketAppointmentRepository.countByTicketId(ticketId);
    const isFirstAppointment = existingCount === 0;

    const status =
      input.status != null &&
      Object.values(ServiceTicketAppointmentStatus).includes(input.status)
        ? input.status
        : ServiceTicketAppointmentStatus.SCHEDULED;

    const row = await ServiceTicketAppointmentRepository.create({
      ticketId,
      description,
      scheduledAt,
      attendingUserId,
      status,
    });

    if (isFirstAppointment) {
      await ServiceTicketStatusHistoryService.createStatusHistoryEvents(
        ticketId,
        [
          ServiceTicketStatusHistoryEventType.VISIT_SCHEDULED,
          ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
        ],
        ticket.status,
        changedBy,
      );

      if (ticket.status === ServiceTicketStatus.PENDING) {
        await ServiceTicketService.update(ticketId, {
          status: ServiceTicketStatus.CONTACTED,
        });
      }
    } else {
      await ServiceTicketStatusHistoryService.createStatusHistoryEvents(
        ticketId,
        [ServiceTicketStatusHistoryEventType.VISIT_SCHEDULED],
        ticket.status,
        changedBy,
      );
    }

    await this.syncTicketScheduledFromAppointments(ticketId);

    const withUser = await ServiceTicketAppointmentRepository.findOneBy(
      row.id,
      ticketId,
      ["attendingUser"],
    );
    return withUser ? this.serialize(withUser) : this.serialize(row);
  }

  static async delete(
    ticketId: number,
    appointmentId: number,
    changedBy: number,
  ): Promise<void> {
    if (
      !Number.isFinite(ticketId) ||
      ticketId <= 0 ||
      !Number.isFinite(appointmentId) ||
      appointmentId <= 0
    ) {
      throw new Error("Identificador inválido.");
    }

    const existing = await ServiceTicketAppointmentRepository.findOneBy(
      appointmentId,
      ticketId,
      [],
    );
    if (!existing) {
      throw new Error("Cita no encontrada.");
    }

    const countBefore =
      await ServiceTicketAppointmentRepository.countByTicketId(ticketId);

    await ServiceTicketAppointmentRepository.deleteById(
      appointmentId,
      ticketId,
    );

    if (countBefore <= 1) {
      await ServiceTicketStatusHistoryService.deleteStatusHistoryEvents([
        {
          ticketId,
          eventType: ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
        },
      ]);
      await ServiceTicketService.update(ticketId, {
        serviceScheduledFor: null,
      });
      return;
    }

    await this.syncTicketScheduledFromAppointments(ticketId);
  }

  static async updateScheduledAt(
    ticketId: number,
    appointmentId: number,
    scheduledAt: Date,
  ): Promise<ServiceTicketAppointmentDTO | null> {
    if (
      !Number.isFinite(ticketId) ||
      ticketId <= 0 ||
      !Number.isFinite(appointmentId) ||
      appointmentId <= 0 ||
      Number.isNaN(scheduledAt.getTime())
    ) {
      return null;
    }
    const row = await ServiceTicketAppointmentRepository.update(
      appointmentId,
      ticketId,
      { scheduledAt },
    );
    await this.syncTicketScheduledFromAppointments(ticketId);
    const withUser = await ServiceTicketAppointmentRepository.findOneBy(
      row.id,
      ticketId,
      ["attendingUser"],
    );
    return withUser ? this.serialize(withUser) : this.serialize(row);
  }

  static async deleteAllForTicket(ticketId: number): Promise<void> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return;

    await ServiceTicketAppointmentRepository.deleteAllByTicketId(ticketId);
    await ServiceTicketStatusHistoryService.deleteStatusHistoryEvents([
      {
        ticketId,
        eventType: ServiceTicketStatusHistoryEventType.FIRST_CONTACT,
      },
    ]);
    await ServiceTicketService.update(ticketId, {
      serviceScheduledFor: null,
    });
  }

  static async updateStatus(
    ticketId: number,
    appointmentId: number,
    status: ServiceTicketAppointmentStatus,
  ): Promise<ServiceTicketAppointmentDTO | null> {
    if (
      !Number.isFinite(ticketId) ||
      ticketId <= 0 ||
      !Number.isFinite(appointmentId) ||
      appointmentId <= 0
    ) {
      return null;
    }
    if (!Object.values(ServiceTicketAppointmentStatus).includes(status)) {
      throw new Error("Estado de cita inválido.");
    }
    const row = await ServiceTicketAppointmentRepository.update(
      appointmentId,
      ticketId,
      { status },
    );
    const withUser = await ServiceTicketAppointmentRepository.findOneBy(
      row.id,
      ticketId,
      ["attendingUser"],
    );
    return withUser ? this.serialize(withUser) : this.serialize(row);
  }

  static async markAsCompleted(
    ticketId: number,
    appointmentId: number,
    changedBy: number,
  ): Promise<ServiceTicketAppointmentDTO> {
    if (
      !Number.isFinite(ticketId) ||
      ticketId <= 0 ||
      !Number.isFinite(appointmentId) ||
      appointmentId <= 0
    ) {
      throw new Error("Identificador inválido.");
    }

    const existing = await ServiceTicketAppointmentRepository.findOneBy(
      appointmentId,
      ticketId,
      ["attendingUser"],
    );
    if (!existing) {
      throw new Error("Cita no encontrada.");
    }
    if (existing.status === ServiceTicketAppointmentStatus.COMPLETED) {
      throw new Error("La cita ya está marcada como realizada.");
    }
    if (existing.status === ServiceTicketAppointmentStatus.CANCELLED) {
      throw new Error("No se puede marcar como realizada una cita cancelada.");
    }

    const all = await ServiceTicketAppointmentRepository.findAllByTicketId(
      ticketId,
      [],
    );
    const firstByOrder = all[0] ?? null;
    const isFirstAppointment = firstByOrder?.id === appointmentId;

    await ServiceTicketAppointmentRepository.update(appointmentId, ticketId, {
      status: ServiceTicketAppointmentStatus.COMPLETED,
    });

    if (isFirstAppointment) {
      const ticket = await ServiceTicketService.getById(ticketId, []);
      if (!ticket) {
        throw new Error("Ticket no encontrado.");
      }
      const history = await ServiceTicketStatusHistoryService.listByTicket(
        ticketId,
      );
      const hasVisitCompleted = history.some(
        (h) =>
          h.eventType === ServiceTicketStatusHistoryEventType.VISIT_COMPLETED,
      );
      if (!hasVisitCompleted) {
        await ServiceTicketStatusHistoryService.create({
          ticketId,
          status: ticket.status,
          eventType: ServiceTicketStatusHistoryEventType.VISIT_COMPLETED,
          changedBy,
        });
      }
    }

    const withUser = await ServiceTicketAppointmentRepository.findOneBy(
      appointmentId,
      ticketId,
      ["attendingUser"],
    );
    return withUser
      ? this.serialize(withUser)
      : this.serialize({ ...existing, status: ServiceTicketAppointmentStatus.COMPLETED });
  }

  /** Keeps legacy `tick_service_scheduled_for` aligned with the earliest appointment. */
  static async syncTicketScheduledFromAppointments(
    ticketId: number,
  ): Promise<void> {
    const rows = await ServiceTicketAppointmentRepository.findAllByTicketId(
      ticketId,
      [],
    );
    const first = rows[0] ?? null;
    await ServiceTicketService.update(ticketId, {
      serviceScheduledFor: first?.scheduledAt ?? null,
    });
  }

  static async ensureAttendingUserInOrganization(
    userId: number,
    organizationId: number,
  ): Promise<boolean> {
    if (!Number.isFinite(userId) || userId <= 0) return false;
    const membership = await OrganizationMemberRepository.findOneBy(
      { userId, organizationId },
      [],
    );
    return membership != null && membership.userId != null;
  }
}
