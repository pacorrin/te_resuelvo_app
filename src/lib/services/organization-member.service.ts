import { OrganizationMemberRepository } from "@/src/lib/repositories/OrganizationMember.repo";
import {
  CreateOrganizationMemberDTO,
  InviteOrganizationMemberDTO,
  OrganizationMemberDTO,
} from "../dtos/OrganizationMembers.dto";
import { OrganizationMember } from "../entities/OrganizationMember.entity";
import { UserService } from "./user.service";

export class OrganizationMemberService {
  static serializeMember(member: OrganizationMember): OrganizationMemberDTO {
    return {
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      userEmail: member.userEmail,
      role: member.role,
      isInvitation: member.isInvitation,
      user: member.user ? UserService.serializeUser(member.user) : null,
    };
  }

  static async inviteMemberToOrganization(
    data: InviteOrganizationMemberDTO,
  ): Promise<OrganizationMemberDTO> {
    const user = await UserService.getUserProfile(data.userEmail);
    let newMember: CreateOrganizationMemberDTO;
    let member: OrganizationMemberDTO;
    if (user) {
      newMember = {
        organizationId: data.organizationId,
        userId: user.id,
        userEmail: data.userEmail,
        role: data.role,
        isInvitation: false,
      };
       member = await this.addMemberToOrganization(newMember);
       if (member) {
        member.user = UserService.serializeUser(user);
       }
    }else {
      newMember = {
        organizationId: data.organizationId,
        userId: null,
        userEmail: data.userEmail,
        role: data.role,
        isInvitation: true,
      };
      member = await this.addMemberToOrganization(newMember);
    }

    // TODO: Send invitation email to the member
    return member;
  }

  static async addMemberToOrganization(
    data: CreateOrganizationMemberDTO,
  ): Promise<OrganizationMemberDTO> {
    const member = await OrganizationMemberRepository.createMember(data);
    return this.serializeMember(member);
  }

  static async removeMemberFromOrganization(relationId: number): Promise<void> {
    await OrganizationMemberRepository.removeMember(relationId);
  }

  static async getOrganizationMembers(
    organizationId: number,
  ): Promise<OrganizationMemberDTO[]> {
    const members =
      await OrganizationMemberRepository.findByOrganization(organizationId);
    return members.map((m) => this.serializeMember(m));
  }

  static async getUserOrganizations(
    userId: number,
  ): Promise<OrganizationMemberDTO[]> {
    const memberships = await OrganizationMemberRepository.findByUser(userId);
    return memberships.map((m) => this.serializeMember(m));
  }

  static async checkUserHasOrganization(userId: number): Promise<boolean> {
    const memberships = await OrganizationMemberRepository.findByUser(userId);
    return memberships.length > 0;
  }

  static async getMemberById(
    id: number,
    relations: ("organization" | "user")[] = [],
  ): Promise<OrganizationMemberDTO | null> {
    const member = await OrganizationMemberRepository.findOneBy(
      { id },
      relations,
    );
    if (!member) return null;
    return this.serializeMember(member);
  }
}
