import { OrganizationMemberRoles } from "../enums/organization-members.enum";
import { SerializedUser } from "./Users.dto";

export interface OrganizationMemberDTO {
  id: number;
  organizationId: number;
  userId?: number | null;
  userEmail: string;
  role: OrganizationMemberRoles;
  isInvitation: boolean;
  user?: SerializedUser | null;
}

export interface CreateOrganizationMemberDTO {
  organizationId: number;
  userId?: number | null;
  userEmail: string;
  role?: OrganizationMemberRoles;
  isInvitation?: boolean;
}


export interface InviteOrganizationMemberDTO {
  organizationId: number;
  userEmail: string;
  role?: OrganizationMemberRoles;
}

export interface UpdateOrganizationMemberDTO {
  role?: number;  
  isInvitation?: boolean;
}
