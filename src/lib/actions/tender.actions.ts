"use server";

import { getErrorMessage } from "@/src/lib/utils/error";
import { TenderService } from "@/src/lib/services/tender.service";
import {
  CreateTenderFromPublicSiteDTO,
  TenderFollowUpDTO,
  type TenderClientListDTO,
} from "../dtos/Tenders.dto";
import { ActionResponse } from "../utils/action-response";
import { protectedAction } from "../protected-action";
import { OrganizationMemberRepository } from "../repositories/OrganizationMember.repo";
import { TenderBuyerService } from "../services/tender-buyer.service";

export async function _createTenderFromPublicSiteAction(
  data: CreateTenderFromPublicSiteDTO,
): Promise<ActionResponse<Record<string, any> | null>> {
  try {
    const tender = await TenderService.createTenderFromPublicSite(data);
    return { success: true, data: TenderService.serializeTender(tender)};
  } catch (error) {
    console.error("Error creating tender:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _getTenderAction(
  id: number,
): Promise<ActionResponse<TenderClientListDTO | null>> {
  try {
    const tender = await TenderService.getTenderById(id);
    return {
      success: true,
      data: tender ? TenderService.serializeTenderClientList(tender) : null,
    };
  } catch (error) {
    console.error("Error fetching tender:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _getTendersByCustomerAction(
  customerId: number,
): Promise<ActionResponse<TenderClientListDTO[]>> {
  try {
    const tenders = await TenderService.getTendersByCustomer(customerId);
    return {
      success: true,
      data: tenders.map((t) => TenderService.serializeTenderClientList(t)),
    };
  } catch (error) {
    console.error("Error fetching customer tenders:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _getTendersNearbyByCoordinates(
  latitude: number,
  longitude: number,
  organizationId?: number,
): Promise<ActionResponse<TenderClientListDTO[]>> {
  try {
    const tenders = await TenderService.getTendersNearbyByCoordinates({
      latitude,
      longitude,
      ...(organizationId != null ? { organizationId } : {}),
    });
    return {
      success: true,
      data: tenders.map((t) => TenderService.serializeTenderClientList(t)),
    };
  } catch (error) {
    console.error("Error fetching nearby tenders:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Tenders whose location falls inside at least one of the organization's coverage disks.
 * Caller must be a member of that organization.
 */
export const _getTendersForOrganizationCoverageAction = protectedAction(
  async (
    session,
    organizationId: number,
  ): Promise<ActionResponse<TenderClientListDTO[]>> => {
    try {
      const userId = Number(session.user?.id);
      if (!Number.isFinite(userId)) {
        return { success: false, error: "Sesión inválida" };
      }

      const membership = await OrganizationMemberRepository.findOneBy({
        userId,
        organizationId,
      });
      if (!membership) {
        return {
          success: false,
          error: "No tienes acceso a esta organización.",
        };
      }

      const tenders =
        await TenderService.getTendersForOrganizationCoverage(organizationId);
      return { success: true, data: tenders };
    } catch (error) {
      console.error("Error fetching tenders for organization coverage:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

/** Tenders this organization has successfully paid for. */
export const _getPurchasedTendersForOrganizationAction = protectedAction(
  async (
    session,
    organizationId: number,
  ): Promise<ActionResponse<TenderClientListDTO[]>> => {
    try {
      const userId = Number(session.user?.id);
      if (!Number.isFinite(userId)) {
        return { success: false, error: "Sesión inválida" };
      }

      const membership = await OrganizationMemberRepository.findOneBy({
        userId,
        organizationId,
      });
      if (!membership) {
        return {
          success: false,
          error: "No tienes acceso a esta organización.",
        };
      }

      const tenders =
        await TenderBuyerService.getPaidTendersForOrganization(organizationId);
      return { success: true, data: tenders };
    } catch (error) {
      console.error("Error fetching purchased tenders:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);
