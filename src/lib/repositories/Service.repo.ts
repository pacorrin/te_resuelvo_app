import { getDataSource } from "@/src/lib/db/connection";
import { Service } from "@/src/lib/entities/Service.entity";
import { FindOptionsWhere, Like, Repository } from "typeorm";
import { SearchService } from "../enums/service.enum";


export class ServiceRepository {
  private static async getRepo(): Promise<Repository<Service>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("Service");
  }

  static async findOneBy(
    searchParams: SearchService,
    select?: (keyof Service)[],
  ): Promise<Service | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      select: select || [
        "id",
        "name",
        "leadPrice",
        "description",
        "businessSectorId",
        "createdAt",
      ],
    });
  }

  static async findBy(searchParams: SearchService, select?: (keyof Service)[]) {
    const repo = await this.getRepo();
    const where: FindOptionsWhere<Service> = {
      ...searchParams,
    };
    if (searchParams.name) {
      where.name = Like(`%${searchParams.name}%`);
    }
    return repo.find({
      where,
      select: select || [
        "id",
        "name",
        "leadPrice",
        "description",
        "businessSectorId",
        "createdAt",
      ],
    });
  }

  static async findAll(
    searchParams: SearchService = {},
    select?: (keyof Service)[],
  ): Promise<Service[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      select: select || [
        "id",
        "name",
        "leadPrice",
        "description",
        "businessSectorId",
        "createdAt",
      ],
    });
  }

  static async createService(data: Partial<Service>): Promise<Service> {
    const repo = await this.getRepo();
    const service = repo.create(data);
    return repo.save(service);
  }

  static async updateService(
    id: number,
    data: Partial<Service>,
  ): Promise<Service> {
    const repo = await this.getRepo();
    const service = await this.findOneBy({ id });
    if (!service) {
      throw new Error("Service not found");
    }
    return repo.save({ ...service, ...data });
  }
}
