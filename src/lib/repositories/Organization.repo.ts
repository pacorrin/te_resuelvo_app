import { getDataSource } from "@/src/lib/db/connection";
import { Organization } from "@/src/lib/entities/Organization.entity";
import { Repository } from "typeorm";
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
} from "../dtos/Organizations.dto";
import { OrganizationBusinessType } from "../enums/organizations.enum";

export class OrganizationRepository {
  private static async getRepo(): Promise<Repository<Organization>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("Organization");
  }

  static async findOneBy(id: number): Promise<Organization | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { id },
      relations: ["administrator"],
    });
  }

  static async findAll(): Promise<Organization[]> {
    const repo = await this.getRepo();
    return repo.find({
      relations: ["administrator"],
    });
  }

  static async createOrganization(
    data: CreateOrganizationDTO,
  ): Promise<Organization> {
    const repo = await this.getRepo();
    const organization = repo.create({
      ...data,
      businessType: Number(data.businessType),
    });
    return repo.save(organization);
  }

  static async updateOrganization(
    id: number,
    data: UpdateOrganizationDTO,
  ): Promise<Organization> {
    const repo = await this.getRepo();
    const organization = await this.findOneBy(id);
    if (!organization) {
      throw new Error("Organization not found");
    }
    const updatedOrganization = await repo.save({ ...organization, ...data });
    return updatedOrganization;
  }
}
