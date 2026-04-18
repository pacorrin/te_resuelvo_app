import { getDataSource } from "@/src/lib/db/connection";
import { OrganizationService } from "@/src/lib/entities/OrganizationService.entity";
import { Repository } from "typeorm";

export interface SearchOrganizationService {
  id?: number;
  organizationId?: number;
  serviceId?: number;
}

export class OrganizationServiceRepository {
  private static async getRepo(): Promise<Repository<OrganizationService>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("OrganizationService");
  }

  static async findOneBy(
    searchParams: SearchOrganizationService,
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationService | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findAll(
    searchParams: SearchOrganizationService = {},
    relations: ("organization" | "service")[] = [],
  ): Promise<OrganizationService[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      relations,
    });
  }

  static async createOrganizationService(data: {
    organizationId: number;
    serviceId: number;
  }): Promise<OrganizationService> {
    const repo = await this.getRepo();
    const row = repo.create(data);
    return repo.save(row);
  }

  static async deleteOrganizationService(id: number): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete({ id });
  }

  static async deleteByOrganizationAndService(
    organizationId: number,
    serviceId: number,
  ): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete({ organizationId, serviceId });
  }
}
