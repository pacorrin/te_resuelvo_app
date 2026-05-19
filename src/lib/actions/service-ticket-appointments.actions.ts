"use server";

import type {
  CreateServiceTicketAppointmentInput,
  ServiceTicketAppointmentDTO,
} from "@/src/lib/dtos/ServiceTicketAppointment.dto";
import { ServiceTicketAppointmentService } from "@/src/lib/services/service-ticket-appointment.service";
import { ServiceTicketService } from "@/src/lib/services/service-tickets.service";
import { protectedAction } from "@/src/lib/protected-action";
import type { ActionResponse } from "@/src/lib/utils/action-response";
import { getErrorMessage } from "@/src/lib/utils/error";

export const _listServiceTicketAppointments = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<ServiceTicketAppointmentDTO[]>> => {
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
      const rows = await ServiceTicketAppointmentService.listByTicket(ticketId);
      return { success: true, data: rows };
    } catch (error) {
      console.error("Error listing service ticket appointments:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _createServiceTicketAppointment = protectedAction(
  async (
    session,
    ticketId: number,
    input: CreateServiceTicketAppointmentInput,
  ): Promise<ActionResponse<ServiceTicketAppointmentDTO>> => {
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
      const created = await ServiceTicketAppointmentService.create(
        ticketId,
        input,
        userId,
      );
      if (!created) {
        return { success: false, error: "No se pudo crear la cita." };
      }
      return { success: true, data: created };
    } catch (error) {
      console.error("Error creating service ticket appointment:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _completeServiceTicketAppointment = protectedAction(
  async (
    session,
    ticketId: number,
    appointmentId: number,
  ): Promise<ActionResponse<ServiceTicketAppointmentDTO>> => {
    const userId = Number(session.user.id);
    if (
      !Number.isFinite(ticketId) ||
      ticketId <= 0 ||
      !Number.isFinite(appointmentId) ||
      appointmentId <= 0
    ) {
      return { success: false, error: "Parámetros inválidos." };
    }
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const updated = await ServiceTicketAppointmentService.markAsCompleted(
        ticketId,
        appointmentId,
        userId,
      );
      return { success: true, data: updated };
    } catch (error) {
      console.error("Error completing service ticket appointment:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _deleteServiceTicketAppointment = protectedAction(
  async (
    session,
    ticketId: number,
    appointmentId: number,
  ): Promise<ActionResponse<{ deleted: true }>> => {
    const userId = Number(session.user.id);
    if (
      !Number.isFinite(ticketId) ||
      ticketId <= 0 ||
      !Number.isFinite(appointmentId) ||
      appointmentId <= 0
    ) {
      return { success: false, error: "Parámetros inválidos." };
    }
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      await ServiceTicketAppointmentService.delete(
        ticketId,
        appointmentId,
        userId,
      );
      return { success: true, data: { deleted: true } };
    } catch (error) {
      console.error("Error deleting service ticket appointment:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);
