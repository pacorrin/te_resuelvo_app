"use server";

import { protectedAction } from "@/src/lib/protected-action";
import {
  ServiceTicketService,
  type ServiceTicketDTO,
} from "@/src/lib/services/service-tickets.service";
import type { FileDTO } from "../dtos/File.dto";
import { FileService } from "../services/file.service";
import { OrganizationMemberService } from "../services/organization-member.service";
import { FileOwnerType } from "../storage/storage.enums";
import type { ActionResponse } from "../utils/action-response";
import { getErrorMessage } from "../utils/error";
import {
  ServiceTicketPaymentBalanceType,
  ServiceTicketStatus,
  ServiceTicketStatusHistoryEventType,
} from "../enums/service-tickets.enum";
import {
  ServiceTicketPaymentService,
  type ServiceTicketPaymentDTO,
} from "../services/service-ticket-payment.service";
import { ServiceTicketStatusHistoryService } from "../services/service-ticket-status-history.service";
import { ServiceTicketAppointmentService } from "../services/service-ticket-appointment.service";

export const _scheduleServiceAppointment = protectedAction(
  async (
    session,
    ticketId: number,
    serviceScheduledFor: string | null,
  ): Promise<ActionResponse<ServiceTicketDTO>> => {
    const userId = Number(session.user.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }

    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }

      if (
        serviceScheduledFor == null ||
        String(serviceScheduledFor).trim() === ""
      ) {
        await ServiceTicketAppointmentService.deleteAllForTicket(ticketId);
        const ticket = await ServiceTicketService.getById(ticketId);
        if (!ticket) {
          return { success: false, error: "Ticket no encontrado." };
        }
        return {
          success: true,
          data: ServiceTicketService.serialize(ticket),
        };
      }

      const parsed = new Date(serviceScheduledFor);
      if (Number.isNaN(parsed.getTime())) {
        return { success: false, error: "Fecha u hora inválida." };
      }

      const existing =
        await ServiceTicketAppointmentService.listByTicket(ticketId);
      if (existing.length === 0) {
        await ServiceTicketAppointmentService.create(
          ticketId,
          {
            description: "Primera visita",
            scheduledAt: parsed.toISOString(),
            attendingUserId: userId,
          },
          userId,
        );
      } else {
        const first = existing[0];
        await ServiceTicketAppointmentService.updateScheduledAt(
          ticketId,
          first.id,
          parsed,
        );
      }

      const ticket = await ServiceTicketService.getById(ticketId);
      if (!ticket) {
        return { success: false, error: "Ticket no encontrado." };
      }
      return { success: true, data: ServiceTicketService.serialize(ticket) };
    } catch (error) {
      console.error("Error scheduling service appointment:", error);
      return {
        success: false,
        error: getErrorMessage(error),
      };
    }
  },
);

export const _recordServiceTicketVisitCompleted = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<{ recorded: true }>> => {
    const userId = Number(session.user.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const existing = await ServiceTicketStatusHistoryService.listByTicket(
        ticketId,
      );
      if (
        existing.some(
          (r) => r.eventType === ServiceTicketStatusHistoryEventType.VISIT_COMPLETED,
        )
      ) {
        return { success: true, data: { recorded: true } };
      }
      await ServiceTicketService.markTicketVisitCompleted(ticketId, userId);
      return { success: true, data: { recorded: true } };
    } catch (error) {
      console.error("Error recording visit completed:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _getTicketsByOrganization = protectedAction(
  async (session, organizationId: number) => {
    const userId = Number(session.user.id);
    const canAccess =
      await OrganizationMemberService.userBelongsToOrganization(
        userId,
        organizationId,
      );
    if (!canAccess) {
      return { success: false, error: "No tienes acceso a esta organización." };
    }
    const serviceTickets = await ServiceTicketService.getAllBy({
      organizationId,
    });
    return { success: true, data: serviceTickets };
  },
);

export const _getTicketById = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<ServiceTicketDTO>> => {
    const userId = Number(session.user.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    const ticket = await ServiceTicketService.getById(ticketId);
    if (!ticket) {
      return { success: false, error: "Ticket no encontrado." };
    }
    return { success: true, data: ServiceTicketService.serialize(ticket) };
  },
);

export const _updateTicketStatus = protectedAction(
  async (session, ticketId: number, status: ServiceTicketStatus) => {
    const userId = Number(session.user.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    if (!Number.isFinite(status) || status <= 0) {
      return { success: false, error: "Estado de ticket inválido." };
    }
    const ticket = await ServiceTicketService.markStatus(
      ticketId,
      status,
      userId,
    );
    return { success: true, data: ServiceTicketService.serialize(ticket) };
  },
);

export const _getServiceTicketQuoteFile = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<FileDTO | null>> => {
    const userId = Number(session.user.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const files = await FileService.getByOwner(
        FileOwnerType.SERVICE_TICKET_QUOTE,
        ticketId,
      );
      if (files.length === 0) {
        return { success: true, data: null };
      }
      const latest = files.reduce((a, b) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
          ? a
          : b,
      );
      return { success: true, data: latest };
    } catch (error) {
      console.error("Error getting service ticket quote:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _uploadServiceTicketQuote = protectedAction(
  async (
    session,
    ticketId: number,
    file: File,
  ): Promise<ActionResponse<FileDTO>> => {
    const userId = Number(session.user.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }

    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
        "No tienes acceso a subir archivos para este ticket.",
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const ticket = await ServiceTicketService.getById(ticketId, []);
      if (!ticket) {
        return { success: false, error: "Ticket no encontrado." };
      }
      if (
        ticket.status != ServiceTicketStatus.COMPLETED &&
        ticket.status != ServiceTicketStatus.CANCELLED &&
        ticket.status != ServiceTicketStatus.QUOTED
      ) {
        await ServiceTicketService.update(ticketId, {
          status: ServiceTicketStatus.QUOTED,
        });
        await ServiceTicketService.createStatusEventHistoryForStatus(
          ticketId,
          ServiceTicketStatus.QUOTED,
          Number(userId),
        );
      }

      const data = await ServiceTicketService.uploadQuote(ticketId, file);
      return { success: true, data };
    } catch (error) {
      console.error("Error uploading service ticket quote:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _listServiceTicketPayments = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<ServiceTicketPaymentDTO[]>> => {
    const userId = Number(session.user.id);
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const rows = await ServiceTicketPaymentService.listByTicket(ticketId);
      return { success: true, data: rows };
    } catch (error) {
      console.error("Error listing service ticket payments:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _createServiceTicketPayment = protectedAction(
  async (
    session,
    ticketId: number,
    input: {
      balanceType: ServiceTicketPaymentBalanceType;
      amount: number;
      description?: string | null;
    },
  ): Promise<ActionResponse<ServiceTicketPaymentDTO>> => {
    const userId = Number(session.user.id);
    const balanceType = Number(input.balanceType);
    if (
      balanceType !== ServiceTicketPaymentBalanceType.CREDIT &&
      balanceType !== ServiceTicketPaymentBalanceType.DEBIT
    ) {
      return { success: false, error: "Tipo de movimiento inválido." };
    }
    const rawAmount = Number(input.amount);
    if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
      return { success: false, error: "El monto debe ser mayor que cero." };
    }
    const amount = Math.round(rawAmount * 100) / 100;
    if (amount > 99_999_999.99) {
      return { success: false, error: "Monto demasiado grande." };
    }
    let description: string | null =
      input.description != null && String(input.description).trim() !== ""
        ? String(input.description).trim()
        : null;
    if (description && description.length > 150) {
      description = description.slice(0, 150);
    }
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const created = await ServiceTicketPaymentService.create(ticketId, {
        balanceType,
        amount,
        description,
      });
      if (!created) {
        return { success: false, error: "No se pudo registrar el movimiento." };
      }
      return { success: true, data: created };
    } catch (error) {
      console.error("Error creating service ticket payment:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);
