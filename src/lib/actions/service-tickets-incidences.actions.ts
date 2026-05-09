"use server";

import { ServiceTicketIncidenceDTO, ServiceTicketIncidenceService } from "@/src/lib/services/service-ticket-incidence.service";
import { protectedAction } from "../protected-action";
import type { CreateServiceTicketIncidenceInput } from "../dtos/ServiceTicketIncidence.dto";
import { getErrorMessage } from "../utils/error";
import { ActionResponse } from "../utils/action-response";

export const createServiceTicketIncidence = protectedAction(
  async (
    _,
    { ticketId, type, description }: CreateServiceTicketIncidenceInput,
  ): Promise<ActionResponse<ServiceTicketIncidenceDTO | null>> => {
    try {
      const incidence = await ServiceTicketIncidenceService.create(ticketId, {
        type,
        description,
      });
      return { success: true, data: incidence };
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