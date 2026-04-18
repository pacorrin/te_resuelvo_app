"use server";

import { protectedAction } from "../protected-action";
import { OrganizationServiceLinkService } from "../services/organization-service.service";
import { getErrorMessage } from "../utils/error";

export const _assignServiceToOrganization = protectedAction(
  async (_, organizationId: number, serviceId: number) => {
    try {
      const service = await OrganizationServiceLinkService.addServiceToOrganization(organizationId, serviceId);
      return { success: true, service };
    } catch (error) {
      console.error("Error assigning service to organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _removeServiceFromOrganization = protectedAction(
  async (_, relationId: number) => {
    try {
      const service = await OrganizationServiceLinkService.removeServiceFromOrganization(relationId);
      return { success: true, service };
    } catch (error) {
      console.error("Error removing service from organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _getOrganizationServices = protectedAction(
  async (_, organizationId: number) => {
    try {
      const services = await OrganizationServiceLinkService.getByOrganization(organizationId, ["service"]);
      return { success: true, services };
    } catch (error) {
      console.error("Error getting services by organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);