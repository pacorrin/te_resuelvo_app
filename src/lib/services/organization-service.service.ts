import { OrganizationServiceRepository } from "@/src/lib/repositories/OrganizationService.repo";
import { OrganizationService } from "@/src/lib/entities/OrganizationService.entity";
import type { OrganizationServiceDTO } from "@/src/lib/dtos/OrganizationServices.dto";
import { ServiceService } from "./service.service";

export class OrganizationServiceLinkService {
  static serialize(
    row: OrganizationService,
  ): OrganizationServiceDTO {
    return {
      id: row.id,
      organizationId: row.organizationId,
      serviceId: row.serviceId,
      service: row.service ? ServiceService.serialize(row.service) : null,
    };
  }

  static async getById(
    id: number,
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationServiceDTO | null> {
    const row = await OrganizationServiceRepository.findOneBy({ id }, relations);
    if (!row) return null;
    return this.serialize(row);
  }

  static async getByOrganization(
    organizationId: number,
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationServiceDTO[]> {
    const rows = await OrganizationServiceRepository.findAll(
      { organizationId },
      relations,
    );
    return rows.map((r) => this.serialize(r));
  }

  static async getByService(
    serviceId: number,
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationServiceDTO[]> {
    const rows = await OrganizationServiceRepository.findAll(
      { serviceId },
      relations,
    );
    return rows.map((r) => this.serialize(r));
  }

  static async addServiceToOrganization(
    organizationId: number,
    serviceId: number,
  ): Promise<OrganizationServiceDTO> {
    const row = await OrganizationServiceRepository.createOrganizationService({
      organizationId,
      serviceId,
    });
    return this.serialize(row);
  }

  static async removeServiceFromOrganization(id: number): Promise<void> {
    await OrganizationServiceRepository.deleteOrganizationService(id);
  }

  static async removeByOrganizationAndService(
    organizationId: number,
    serviceId: number,
  ): Promise<void> {
    await OrganizationServiceRepository.deleteByOrganizationAndService(
      organizationId,
      serviceId,
    );
  }
}
