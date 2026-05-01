"use server";

import { protectedAction } from "@/src/lib/protected-action";
import {
  ServiceTicketService,
  type ServiceTicketDTO,
} from "@/src/lib/services/service-tickets.service";
import { OrganizationMemberRepository } from "../repositories/OrganizationMember.repo";
import type { ActionResponse } from "../utils/action-response";

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
    const serviceTickets = await ServiceTicketService.getAllBy({ organizationId });
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

