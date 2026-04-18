import { OrganizationMemberDTO } from "../dtos/OrganizationMembers.dto";
import { OrganizationMemberRoles } from "../enums/organization-members.enum";

export interface TeamMember extends OrganizationMemberDTO {
  roleName: string;
}

export interface NewTeamMember {
  name: string;
  email: string;
  role: OrganizationMemberRoles;
}

/**
 * Sorts team members with the following priority:
 * 1. Owner (administratorId of the organization) first.
 * 2. Admins (OrganizationMemberRoles.ADMIN).
 * 3. Members (OrganizationMemberRoles.MEMBER).
 * 
 * @param a TeamMember
 * @param b TeamMember
 * @param administratorId (must be bound or provided in context)
 */
export const sortTeamMembersByRole = (
  a: TeamMember,
  b: TeamMember,
  administratorId?: number
) => {
  // If administratorId is provided, put the owner first
  if (administratorId !== undefined) {
    if (a.userId === administratorId && b.userId !== administratorId) return -1;
    if (b.userId === administratorId && a.userId !== administratorId) return 1;
  }
  // Admins before members, invitations (no userId) go last
  if (!a.userId && b.userId) return 1;
  if (a.userId && !b.userId) return -1;
  if (a.role === OrganizationMemberRoles.ADMIN && b.role !== OrganizationMemberRoles.ADMIN) return -1;
  if (b.role === OrganizationMemberRoles.ADMIN && a.role !== OrganizationMemberRoles.ADMIN) return 1;
  if (a.role === OrganizationMemberRoles.MEMBER && b.role !== OrganizationMemberRoles.MEMBER) return -1;
  if (b.role === OrganizationMemberRoles.MEMBER && a.role !== OrganizationMemberRoles.MEMBER) return 1;
  // Otherwise, leave order unchanged
  return 0;
};
