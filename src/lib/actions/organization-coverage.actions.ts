"use server";

import { OrganizationCoverageAreaService } from "../services/organization-coverage-area.service";
import type {
  CreateCoverageAreaDTO,
  OrganizationCoverageAreaDTO,
} from "../dtos/OrganizationCoverageArea.dto";
import { protectedAction } from "../protected-action";
import { getErrorMessage } from "../utils/error";
import { ActionResponse } from "../utils/action-response";

export const _createCoverageArea = protectedAction(
  async (_, data: CreateCoverageAreaDTO): Promise<ActionResponse<OrganizationCoverageAreaDTO>> => {
    try {
      const row = await OrganizationCoverageAreaService.createCoverageArea(data);
      return { success: true, data: row };
    } catch (error) {
      console.error("Error creating coverage area:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _getOrganizationCoverageAreas = protectedAction(
  async (_, organizationId: number): Promise<ActionResponse<OrganizationCoverageAreaDTO[]>> => {
    try {
      const rows =
        await OrganizationCoverageAreaService.getByOrganization(organizationId);
      return { success: true, data: rows };
    } catch (error) {
      console.error("Error getting coverage areas:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _removeCoverageArea = protectedAction(
  async (_, id: number): Promise<ActionResponse<void>> => {
    try {
      await OrganizationCoverageAreaService.deleteCoverageArea(id);
      return { success: true };
    } catch (error) {
      console.error("Error removing coverage area:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);