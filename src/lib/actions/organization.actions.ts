"use server";

import { OrganizationService } from "@/src/lib/services/organization.service";
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  type OrganizationDTO,
} from "@/src/lib/dtos/Organizations.dto";
import { getErrorMessage } from "@/src/lib/utils/error";
import { ActionResponse } from "@/src/lib/utils/action-response";
import { protectedAction } from "@/src/lib/protected-action";


export const _getOrganization = protectedAction(
  async (session): Promise<ActionResponse<OrganizationDTO>> => {
    try {
      const organization = await OrganizationService.getOrganizationByUser(session.user.id);
      return { success: true, data: organization };
    } catch (error) {
      console.error("Error getting organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _createOrganization = protectedAction(
  async (session, data: CreateOrganizationDTO): Promise<ActionResponse<OrganizationDTO>> => {
    try {
      const organization = await OrganizationService.createOrganization({
        ...data,
        administratorId: data.administratorId ?? session.user.id,
      });
      return { success: true, data: organization };
    } catch (error) {
      console.error("Error creating organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _updateOrganization = protectedAction(
  async (_,organizationId: number, data: UpdateOrganizationDTO): Promise<ActionResponse<OrganizationDTO>> => {
    try {
      const organization = await OrganizationService.updateOrganization(organizationId, data);
      return { success: true, data: organization };
    } catch (error) {
      console.error("Error updating organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _uploadOrganizationLogo = protectedAction(
  async (_, organizationId: number, file: File): Promise<ActionResponse<void>> => {
    try {
      await OrganizationService.uploadOrganizationLogo(organizationId, file);
      return { success: true };
    } catch (error) {
      console.error("Error uploading organization logo:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);