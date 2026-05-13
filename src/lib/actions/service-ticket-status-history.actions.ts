"use server";

import type { ServiceTicketStatusHistoryDTO } from "@/src/lib/dtos/ServiceTicketStatusHistory.dto";
import { protectedAction } from "@/src/lib/protected-action";
import { ServiceTicketStatusHistoryService } from "@/src/lib/services/service-ticket-status-history.service";
import type { ActionResponse } from "@/src/lib/utils/action-response";
import { getErrorMessage } from "@/src/lib/utils/error";

export const _listServiceTicketStatusHistory = protectedAction(
  async (
    _,
    ticketId: number,
  ): Promise<ActionResponse<ServiceTicketStatusHistoryDTO[]>> => {
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      return { success: false, error: "Identificador de ticket inválido." };
    }
    try {
      const rows =
        await ServiceTicketStatusHistoryService.listByTicket(ticketId);
      return { success: true, data: rows };
    } catch (error) {
      console.error("Error listing service ticket status history:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);
