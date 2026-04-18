"use server";

import { OrganizationMemberService } from "../services/organization-member.service";
import { getErrorMessage } from "../utils/error";
import { protectedAction } from "../protected-action";
import { InviteOrganizationMemberDTO } from "../dtos/OrganizationMembers.dto";

export const _checkUserHasOrganization = protectedAction(
  async (session) => {
    try {
      const hasOrganization =
        await OrganizationMemberService.checkUserHasOrganization(
          session.user.id,
        );
      console.log("hasOrganization", hasOrganization);
      return { success: true, hasOrganization };
    } catch (error) {
      console.error("Error checking user has organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _getOrganizationMembers = protectedAction(
  async (_, organizationId: number) => {
    try {
      const members = await OrganizationMemberService.getOrganizationMembers(organizationId);
      return { success: true, members };
    } catch (error) {
      console.error("Error getting organization members:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _inviteMemberToOrganization = protectedAction(
  async (_, data: InviteOrganizationMemberDTO) => {
    try {
      const member = await OrganizationMemberService.inviteMemberToOrganization(data);
      return { success: true, member };
    } catch (error) {
      console.error("Error inviting member to organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export const _removeMemberFromOrganization = protectedAction(
  async (_, relationId: number) => {
    try {
      await OrganizationMemberService.removeMemberFromOrganization(relationId);
      return { success: true };
    } catch (error) {
      console.error("Error removing member from organization:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);