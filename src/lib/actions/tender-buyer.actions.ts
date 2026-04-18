"use server";

import { InitPurchaseProcessDTO, UpdatePaymentDTO } from "../dtos/Tenders.dto";
import { TenderBuyer } from "../entities/TenderBuyer.entity";
import { protectedAction } from "../protected-action";
import { TenderBuyerService } from "../services/tender-buyer.service";
import { ActionResponse } from "../utils/action-response";
import { getErrorMessage } from "../utils/error";

export const _initPurchaseProcess = protectedAction(
  async (
    session,
    data: InitPurchaseProcessDTO,
  ): Promise<ActionResponse<TenderBuyer>> => {
    try {
      const tenderBuyer = await TenderBuyerService.initPurchaseProcess({
        ...data,
        buyedBy: session.user.id,
      });
      return { success: true, data: tenderBuyer };
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
  ): Promise<ActionResponse<TenderBuyer>> => {
    try {
      const tenderBuyer = await TenderBuyerService.updatePayment(data);
      return { success: true, data: tenderBuyer };
    } catch (error) {
      console.error("Error updating payment:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _getTenderBuyerByProcessUuid = protectedAction(
  async (
    _,
    processUuid: string,
  ): Promise<ActionResponse<TenderBuyer>> => {
    try {
      const tenderBuyer = await TenderBuyerService.getTenderBuyerByProcessUuid(processUuid);
      return { success: true, data: tenderBuyer };
    } catch (error) {
      console.error("Error getting tender buyer by tender process uuid:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);