"use server";

import { InitPurchaseProcessDTO, UpdatePaymentDTO } from "../dtos/Tenders.dto";
import type {
  TenderBuyerClientDTO,
  TenderBuyerInitProcessDTO,
  TenderBuyerUserSummaryDTO,
} from "../dtos/TenderBuyer.dto";
import { protectedAction } from "../protected-action";
import { ServiceTicketService } from "../services/service-tickets.service";
import { TenderBuyerService } from "../services/tender-buyer.service";
import { ActionResponse } from "../utils/action-response";
import { getErrorMessage } from "../utils/error";

export const _initPurchaseProcess = protectedAction(
  async (
    session,
    data: InitPurchaseProcessDTO,
  ): Promise<ActionResponse<TenderBuyerInitProcessDTO>> => {
    try {
      const tenderBuyer = await TenderBuyerService.initPurchaseProcess({
        ...data,
        buyedBy: session.user.id,
      });
      return {
        success: true,
        data: TenderBuyerService.serializeInitProcess(tenderBuyer),
      };
    } catch (error) {
      console.error("Error initializing purchase process:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _updatePayment = protectedAction(
  async (
    session,
    data: UpdatePaymentDTO,
  ): Promise<ActionResponse<TenderBuyerClientDTO>> => {
    try {
      const tenderBuyer = await TenderBuyerService.updatePayment(data);
      return {
        success: true,
        data: TenderBuyerService.serializeForClient(tenderBuyer),
      };
    } catch (error) {
      console.error("Error updating payment:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _getTenderBuyerUserForTicket = protectedAction(
  async (
    session,
    ticketId: number,
  ): Promise<ActionResponse<TenderBuyerUserSummaryDTO | null>> => {
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
      const ticket = await ServiceTicketService.getById(ticketId, []);
      if (!ticket) {
        return { success: false, error: "Ticket no encontrado." };
      }
      const data =
        await TenderBuyerService.getBuyerUserSummaryForTenderAndOrganization(
          ticket.tenderId,
          ticket.organizationId,
        );
      return { success: true, data };
    } catch (error) {
      console.error("Error loading tender buyer for ticket:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _getTenderBuyerByProcessUuid = protectedAction(
  async (
    _,
    processUuid: string,
  ): Promise<ActionResponse<TenderBuyerClientDTO>> => {
    try {
      const tenderBuyer = await TenderBuyerService.getTenderBuyerByProcessUuid(processUuid);
      return {
        success: true,
        data: TenderBuyerService.serializeForClient(tenderBuyer),
      };
    } catch (error) {
      console.error("Error getting tender buyer by tender process uuid:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);