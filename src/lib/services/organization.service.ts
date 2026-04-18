import { OrganizationRepository } from "@/src/lib/repositories/Organization.repo";
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  OrganizationDTO,
} from "../dtos/Organizations.dto";
import { Organization } from "../entities/Organization.entity";
import { OrganizationCoverageAreaService } from "./organization-coverage-area.service";
import { OrganizationMemberService } from "./organization-member.service";
import { OrganizationMemberRoles } from "../enums/organization-members.enum";
import { OrganizationMemberRepository } from "../repositories/OrganizationMember.repo";
import { UserRepository } from "../repositories/User.repo";
import { saveRequestBodyToLocalFile } from "../storage/local-storage.service";
import { FileCategory, FileOwnerType } from "../storage/storage.enums";
import { FileService } from "./file.service";

export class OrganizationService {
  static serializeOrganization(organization: Organization): OrganizationDTO {
    return {
      id: organization.id,
      name: organization.name,
      businessType: organization.businessType,
      rfc: organization.rfc,
      contactEmail: organization.contactEmail,
      phone: organization.phone,
      fiscalAddress: organization.fiscalAddress,
      description: organization.description,
      image: organization.image,
      administratorId: organization.administratorId,
      credits: organization.credits,
      status: organization.status,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }

  static async createOrganization(
    data: CreateOrganizationDTO,
  ): Promise<OrganizationDTO> {
    const organization = await OrganizationRepository.createOrganization(data);

    if (!organization) throw new Error("Failed to create organization");

    //create the administrator
    if (data.administratorId) {
      const adminUser = await UserRepository.findOneBy(
        { id: data.administratorId },
        ["id", "email"],
      );
      if (!adminUser?.email) {
        throw new Error("Administrator user not found");
      }
      await OrganizationMemberService.addMemberToOrganization({
        userId: data.administratorId,
        userEmail: adminUser.email,
        organizationId: organization.id,
        role: OrganizationMemberRoles.ADMIN,
        isInvitation: false,
      });
    }
    
    //create the coverageZones
    if (data.coverageZones) {
      for (const coverageZone of data.coverageZones) {
        await OrganizationCoverageAreaService.createCoverageArea({
          ...coverageZone,
          organizationId: organization.id,
        });
      }
    }
    return this.serializeOrganization(organization);
  }

  static async updateOrganization(
    organizationId: number,
    data: UpdateOrganizationDTO,
  ): Promise<OrganizationDTO> {
    if(!organizationId) throw new Error("Organization ID is required");
    const organization = await OrganizationRepository.updateOrganization(
      organizationId,
      data,
    );
    return this.serializeOrganization(organization);
  }

  static async getOrganizationById(
    id: number,
  ): Promise<OrganizationDTO | null> {
    const organization = await OrganizationRepository.findOneBy(id);
    if (!organization) return null;
    return this.serializeOrganization(organization);
  }

  static async getOrganizationByUser(
    userId: number,
  ): Promise<OrganizationDTO> {
    const organizationMember = await OrganizationMemberRepository.findOneBy({ userId });
    if (!organizationMember) throw new Error("Organization member not found");
    const organization = await OrganizationRepository.findOneBy(organizationMember.organizationId);
    if (!organization) throw new Error("Organization not found");
    return this.serializeOrganization(organization);
  }

  static async uploadOrganizationLogo(organizationId: number, file: File): Promise<void> {
    const organization = await OrganizationRepository.findOneBy(organizationId);
    if (!organization) throw new Error("Organization not found");
    const result = await saveRequestBodyToLocalFile({
      body: file.stream() as ReadableStream<Uint8Array>,
      fileName: file.name,
      folder: "organizations/logos",
      contentType: file.type || "application/octet-stream",
      allowExtensions: ["jpg", "jpeg", "png", "webp", "svg"],
      fileMetadata: {
        category: FileCategory.LOGO,
        ownerType: FileOwnerType.ORGANIZATION,
        ownerId: organizationId,
      },
    });
    
    await OrganizationRepository.updateOrganization(organizationId, {
      image: result.fileId?.toString(),
    });
  }
}
