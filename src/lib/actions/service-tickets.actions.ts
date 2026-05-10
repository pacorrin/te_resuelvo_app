"use server";

import { protectedAction } from "@/src/lib/protected-action";
import {
  ServiceTicketService,
  type ServiceTicketDTO,
} from "@/src/lib/services/service-tickets.service";
import type { FileDTO } from "../dtos/File.dto";
import { FileService } from "../services/file.service";
import { OrganizationMemberRepository } from "../repositories/OrganizationMember.repo";
import { FileOwnerType } from "../storage/storage.enums";
import type { ActionResponse } from "../utils/action-response";
import { getErrorMessage } from "../utils/error";
import { ServiceTicketStatus } from "../enums/service-tickets.enum";

export const _scheduleServiceAppointment = protectedAction(
  async (
    _,
    ticketId: number,
    serviceScheduledFor: string | null,
  ): Promise<ActionResponse<ServiceTicketDTO>> => {
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }

    let at: Date | null = null;
    if (
      serviceScheduledFor != null &&
      String(serviceScheduledFor).trim() !== ""
    ) {
      const parsed = new Date(serviceScheduledFor);
      if (Number.isNaN(parsed.getTime())) {
        return { success: false, error: "Fecha u hora inválida." };
      }
      at = parsed;
    }

    try {
      const ticket = await ServiceTicketService.setServiceScheduledFor(
        ticketId,
        at,
      );
      return { success: true, data: ServiceTicketService.serialize(ticket) };
    } catch {
      return {
        success: false,
        error: "No se pudo guardar la cita del servicio.",
      };
    }
  },
);

export const _getTicketsByOrganization = protectedAction(
  async (session, organizationId: number) => {
    const userId = Number(session.user?.id);
    if (!Number.isFinite(userId)) {
      return { success: false, error: "Sesión inválida" };
    }
    const membership = await OrganizationMemberRepository.findOneBy({
      userId,
      organizationId,
    });
    if (!membership) {
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
    const userId = Number(session.user?.id);
    if (!Number.isFinite(userId)) {
      return { success: false, error: "Sesión inválida" };
    }
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
    const userId = Number(session.user?.id);
    if (!Number.isFinite(userId)) {
      return { success: false, error: "Sesión inválida" };
    }
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    if (!Number.isFinite(status) || status <= 0) {
      return { success: false, error: "Estado de ticket inválido." };
    }
    const ticket = await ServiceTicketService.markStatus(ticketId, status);
    return { success: true, data: ServiceTicketService.serialize(ticket) };
  },
);

export const _getServiceTicketQuoteFile = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<FileDTO | null>> => {
    const userId = Number(session.user?.id);
    if (!Number.isFinite(userId)) {
      return { success: false, error: "Sesión inválida" };
    }
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    try {
      const ticket = await ServiceTicketService.getById(ticketId, []);
      if (!ticket) {
        return { success: false, error: "Ticket no encontrado." };
      }
      const membership = await OrganizationMemberRepository.findOneBy({
        userId,
        organizationId: ticket.organizationId,
      });
      if (!membership) {
        return {
          success: false,
          error: "No tienes acceso a este ticket.",
        };
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
    const userId = Number(session.user?.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }

    try {
      const ticket = await ServiceTicketService.getById(ticketId, []);
      if (!ticket) {
        return { success: false, error: "Ticket no encontrado." };
      }
      const membership = await OrganizationMemberRepository.findOneBy({
        userId,
        organizationId: ticket.organizationId,
      });
      if (!membership) {
        return {
          success: false,
          error: "No tienes acceso a subir archivos para este ticket.",
        };
      }

      if (
        ticket.status != ServiceTicketStatus.COMPLETED &&
        ticket.status != ServiceTicketStatus.CANCELLED &&
        ticket.status != ServiceTicketStatus.QUOTED
      ) {
        await ServiceTicketService.update(ticketId, {
          status: ServiceTicketStatus.QUOTED,
        });
      }

      const data = await ServiceTicketService.uploadQuote(ticketId, file);
      return { success: true, data };
    } catch (error) {
      console.error("Error uploading service ticket quote:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);
