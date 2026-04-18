import {
  OrganizationCoverageAreaRepository,
  type SearchOrganizationCoverageArea,
} from "@/src/lib/repositories/OrganizationCoverageArea.repo";
import { OrganizationCoverageArea } from "@/src/lib/entities/OrganizationCoverageArea.entity";
import type {
  OrganizationCoverageAreaDTO,
  CreateCoverageAreaDTO,
} from "@/src/lib/dtos/OrganizationCoverageArea.dto";

export class OrganizationCoverageAreaService {
  static serialize(
    row: OrganizationCoverageArea,
  ): OrganizationCoverageAreaDTO {
    return {
      id: row.id,
      organizationId: row.organizationId,
      name: row.name,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      radiusKm: Number(row.radiusKm),
      createdAt: row.createdAt,
    };
  }

  static async getById(
    id: number,
    relations: ("organization")[] = [],
  ): Promise<OrganizationCoverageAreaDTO | null> {
    const row = await OrganizationCoverageAreaRepository.findOneBy(
      { id },
      relations,
    );
    if (!row) return null;
    return this.serialize(row);
  }

  static async getByOrganization(
    organizationId: number,
    relations: ("organization")[] = [],
  ): Promise<OrganizationCoverageAreaDTO[]> {
    const rows = await OrganizationCoverageAreaRepository.findAll(
      { organizationId },
      relations,
    );
    return rows.map((r) => this.serialize(r));
  }

  static async createCoverageArea(
    data: CreateCoverageAreaDTO,
  ): Promise<OrganizationCoverageAreaDTO> {
    const row =
      await OrganizationCoverageAreaRepository.createCoverageArea(data);
    return this.serialize(row);
  }

  static async updateCoverageArea(
    id: number,
    data: Partial<CreateCoverageAreaDTO>,
  ): Promise<OrganizationCoverageAreaDTO> {
    const row = await OrganizationCoverageAreaRepository.updateCoverageArea(
      id,
      data,
    );
    return this.serialize(row);
  }

  static async deleteCoverageArea(id: number): Promise<void> {
    await OrganizationCoverageAreaRepository.deleteCoverageArea(id);
  }
}
