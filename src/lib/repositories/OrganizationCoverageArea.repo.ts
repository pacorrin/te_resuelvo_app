import { getDataSource } from "@/src/lib/db/connection";
import { OrganizationCoverageArea } from "@/src/lib/entities/OrganizationCoverageArea.entity";
import { Repository } from "typeorm";
import type { CreateOrganizationCoverageAreaDTO } from "@/src/lib/dtos/OrganizationCoverageArea.dto";

export interface SearchOrganizationCoverageArea {
  id?: number;
  organizationId?: number;
}

export class OrganizationCoverageAreaRepository {
  private static async getRepo(): Promise<
    Repository<OrganizationCoverageArea>
  > {
    const dataSource = await getDataSource();
    return dataSource.getRepository("OrganizationCoverageArea");
  }

  static async findOneBy(
    searchParams: SearchOrganizationCoverageArea,
    relations: ("organization")[] = [],
  ): Promise<OrganizationCoverageArea | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findAll(
    searchParams: SearchOrganizationCoverageArea = {},
    relations: ("organization")[] = [],
  ): Promise<OrganizationCoverageArea[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      relations,
    });
  }

  static async createCoverageArea(
    data: CreateOrganizationCoverageAreaDTO,
  ): Promise<OrganizationCoverageArea> {
    const repo = await this.getRepo();
    const row = repo.create(data);
    return repo.save(row);
  }

  static async updateCoverageArea(
    id: number,
    data: Partial<CreateOrganizationCoverageAreaDTO>,
  ): Promise<OrganizationCoverageArea> {
    const repo = await this.getRepo();
    const row = await this.findOneBy({ id });
    if (!row) {
      throw new Error("OrganizationCoverageArea not found");
    }
    return repo.save({ ...row, ...data });
  }

  static async deleteCoverageArea(id: number): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete({ id });
  }
}
