import { ServiceRepository } from "@/src/lib/repositories/Service.repo";
import type { SearchService } from "@/src/lib/enums/service.enum";
import { Service } from "@/src/lib/entities/Service.entity";
import type {
  CreateServiceDTO,
  ServiceDTO,
  UpdateServiceDTO,
} from "@/src/lib/dtos/Services.dto";
import { QuestionSetService } from "./question-set.service";
import { QuestionSet } from "../entities/QuestionSet.entity";

const QUESTION_SET_ENTITY = {
  SERVICE: "services",
  BUSINESS_SECTOR: "bussines_sector",
} as const;

export class ServiceService {
  static serialize(row: Service): ServiceDTO {
    return {
      id: row.id,
      name: row.name,
      leadPrice: Number(row.leadPrice),
      description: row.description,
      businessSectorId: row.businessSectorId,
      createdAt: row.createdAt,
    };
  }

  static async getById(
    id: number,
    select?: (keyof Service)[],
  ): Promise<ServiceDTO | null> {
    const row = await ServiceRepository.findOneBy({ id }, select);
    if (!row) return null;
    return this.serialize(row);
  }

  static async findBy(
    searchParams: SearchService = {},
    select?: (keyof Service)[],
  ): Promise<ServiceDTO[]> {
    const rows = await ServiceRepository.findBy(searchParams, select);
    return rows.map((r) => this.serialize(r));
  }

  static async findAll(
    searchParams: SearchService = {},
    select?: (keyof Service)[],
  ): Promise<ServiceDTO[]> {
    const rows = await ServiceRepository.findAll(searchParams, select);
    return rows.map((r) => this.serialize(r));
  }

  static async create(data: CreateServiceDTO): Promise<ServiceDTO> {
    const row = await ServiceRepository.createService({
      name: data.name,
      leadPrice: data.leadPrice ?? 0,
      description: data.description,
      businessSectorId: data.businessSectorId,
    });
    return this.serialize(row);
  }

  static async update(
    id: number,
    data: UpdateServiceDTO,
  ): Promise<ServiceDTO> {
    const row = await ServiceRepository.updateService(id, data);
    return this.serialize(row);
  }

  static async getServiceQuestionSet(serviceId: number): Promise<QuestionSet | null> {
    const serviceQuestionSet = await QuestionSetService.getByEntity(
      QUESTION_SET_ENTITY.SERVICE,
      serviceId,
      true,
    );
    if (serviceQuestionSet) return serviceQuestionSet;

    const service = await ServiceRepository.findOneBy({ id: serviceId });
    if (!service) return null;

    const sectorQuestionSet = await QuestionSetService.getByEntity(
      QUESTION_SET_ENTITY.BUSINESS_SECTOR,
      service.businessSectorId,
      true,
    );
    return sectorQuestionSet ?? null;
  }
}
