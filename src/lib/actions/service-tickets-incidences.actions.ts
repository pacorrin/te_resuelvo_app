"use server";

import type { FileDTO } from "../dtos/File.dto";
import { ServiceTicketService } from "../services/service-tickets.service";
import {
  ServiceTicketIncidenceCreateResult,
  ServiceTicketIncidenceDTO,
  ServiceTicketIncidenceEvidenceBundleDTO,
  ServiceTicketIncidenceService,
} from "@/src/lib/services/service-ticket-incidence.service";
import { protectedAction } from "../protected-action";
import type { CreateServiceTicketIncidenceInput } from "../dtos/ServiceTicketIncidence.dto";
import { getErrorMessage } from "../utils/error";
import { ActionResponse } from "../utils/action-response";

export const createServiceTicketIncidence = protectedAction(
  async (
    session,
    { ticketId, type, description }: CreateServiceTicketIncidenceInput,
    evidenceFiles: File[] = [],
  ): Promise<ActionResponse<ServiceTicketIncidenceCreateResult | null>> => {
    const userId = Number(session.user.id);
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const result = await ServiceTicketIncidenceService.create(
        ticketId,
        { type, description },
        evidenceFiles,
        userId,
      );
      if (!result) {
        return { success: false, error: "No se pudo crear la incidencia." };
      }
      return { success: true, data: result };
    } catch (error) {
      console.error("Error creating service ticket incidence:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _listServiceTicketIncidences = protectedAction(
  async (
    _,
    ticketId: number,
  ): Promise<ActionResponse<ServiceTicketIncidenceDTO[]>> => {
    try {
      const incidences = await ServiceTicketIncidenceService.listByTicket(ticketId);
      return { success: true, data: incidences };
    } catch (error) {
      console.error("Error listing service ticket incidences:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _listServiceTicketIncidenceEvidenceForTicket = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<ServiceTicketIncidenceEvidenceBundleDTO[]>> => {
    const userId = Number(session.user.id);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    try {
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
        "No tienes acceso a las evidencias de este ticket.",
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const data =
        await ServiceTicketIncidenceService.listEvidenceBundlesForTicket(ticketId);
      return { success: true, data };
    } catch (error) {
      console.error("Error listing incidence evidence:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _uploadServiceTicketIncidenceEvidence = protectedAction(
  async (
    session,
    ticketId: number,
    incidenceId: number,
    file: File,
  ): Promise<ActionResponse<FileDTO>> => {
    const userId = Number(session.user.id);
    if (
      !Number.isFinite(ticketId) ||
      ticketId <= 0 ||
      !Number.isFinite(incidenceId) ||
      incidenceId <= 0
    ) {
      return { success: false, error: "Parámetros inválidos." };
    }
    try {
      const dto = await ServiceTicketIncidenceService.findIncidenceDtoForTicket(
        incidenceId,
        ticketId,
      );
      if (!dto) {
        return { success: false, error: "Incidencia no encontrada." };
      }
      const access = await ServiceTicketService.ensureUserMembershipForTicket(
        userId,
        ticketId,
        "No tienes acceso a subir evidencias para este ticket.",
      );
      if (!access.ok) {
        return { success: false, error: access.error };
      }
      const data = await ServiceTicketIncidenceService.uploadEvidence(
        incidenceId,
        file,
      );
      return { success: true, data };
    } catch (error) {
      console.error("Error uploading incidence evidence:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);