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

  private static async enrichWithSectorNames(
    dtos: OrganizationServiceDTO[],
  ): Promise<OrganizationServiceDTO[]> {
    const services = dtos
      .map((d) => d.service)
      .filter((s): s is NonNullable<typeof s> => s != null);
    if (services.length === 0) return dtos;
    const enriched = await ServiceService.attachBusinessSectorNames(services);
    const byId = new Map(enriched.map((s) => [s.id, s]));
    return dtos.map((d) => ({
      ...d,
      service: d.service ? (byId.get(d.service.id) ?? d.service) : null,
    }));
  }

  static async getById(
    id: number,
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationServiceDTO | null> {
    const row = await OrganizationServiceRepository.findOneBy({ id }, relations);
    if (!row) return null;
    const [dto] = await this.enrichWithSectorNames([this.serialize(row)]);
    return dto;
  }

  static async getByOrganization(
    organizationId: number,
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationServiceDTO[]> {
    const rows = await OrganizationServiceRepository.findAll(
      { organizationId },
      relations,
    );
    const dtos = rows.map((r) => this.serialize(r));
    return this.enrichWithSectorNames(dtos);
  }

  static async getByService(
    serviceId: number,
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationServiceDTO[]> {
    const rows = await OrganizationServiceRepository.findAll(
      { serviceId },
      relations,
    );
    const dtos = rows.map((r) => this.serialize(r));
    return this.enrichWithSectorNames(dtos);
  }

  static async addServiceToOrganization(
    organizationId: number,
    serviceId: number,
  ): Promise<OrganizationServiceDTO> {
    const row = await OrganizationServiceRepository.createOrganizationService({
      organizationId,
      serviceId,
    });
    const full = await OrganizationServiceRepository.findOneBy(
      { id: row.id },
      ["service"],
    );
    if (!full) return this.serialize(row);
    const [dto] = await this.enrichWithSectorNames([this.serialize(full)]);
    return dto;
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
