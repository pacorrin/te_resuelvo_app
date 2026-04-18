import { TenderRepository } from "@/src/lib/repositories/Tender.repo";
import type { CoverageDisk } from "@/src/lib/repositories/Tender.repo";
import {
  CreateTenderFromPublicSiteDTO,
  SearchTender,
  SearchTendersNearbyByCoordinates,
  type TenderClientListDTO,
} from "../dtos/Tenders.dto";
import { Tender } from "../entities/Tender.entity";
import { UserService } from "./user.service";
import { OrganizationCoverageAreaService } from "./organization-coverage-area.service";
import { QuestionSetAnswerService } from "./question-set-answer.service";

export class TenderService {
  static serializeTenderClientList(tender: Tender): TenderClientListDTO {
    return {
      id: tender.id,
      serviceId: tender.serviceId,
      description: tender.description,
      personName: tender.personName,
      customerId: tender.customerId,
      tenderAddress: tender.tenderAddress,
      tenderAddressReference: tender.tenderAddressReference,
      longitude: tender.longitude,
      latitude: tender.latitude,
      zipcode: tender.zipcode,
      createdAt: tender.createdAt,
      service: tender.service
        ? {
            id: tender.service.id,
            name: tender.service.name,
            leadPrice: tender.service.leadPrice,
          }
        : null,
      customer: tender.customer
        ? {
            id: tender.customer.id,
            email: tender.customer.email,
            phone: tender.customer.phone ?? null,
            name: tender.customer.name ?? null,
          }
        : null,
    };
  }

  static serializeTender(tender: Tender): Record<string, any> | null {
    if (!tender) return null;
    return {
      id: tender.id,
      serviceId: tender.serviceId,
      description: tender.description,
      personName: tender.personName,
      customerId: tender.customerId,
      customer: tender.customer
        ? {
            id: tender.customer.id,
            email: tender.customer.email,
            phone: tender.customer.phone,
            name: tender.customer.name,
            userType: tender.customer.userType,
            isVerified: tender.customer.isVerified,
            createdAt: tender.customer.createdAt,
            updatedAt: tender.customer.updatedAt,
          }
        : null,
      tenderAddress: tender.tenderAddress,
      longitude: tender.longitude,
      latitude: tender.latitude,
      zipcode: tender.zipcode,
      createdAt: tender.createdAt,
    };
  }

  static async createTenderFromPublicSite(
    data: CreateTenderFromPublicSiteDTO,
  ): Promise<Tender> {
    const { email, phone, personName, questionSetAnswers, ...tenderData } = data;
    console.log(questionSetAnswers);
    const user = await UserService.createUserFromPublicSite({
      email,
      name: personName,
      phone,
    });

    const tender = await TenderRepository.createTender({
      ...tenderData,
      personName,
      customerId: user?.id,
    });

    if (questionSetAnswers?.length) {
      await Promise.all(
        questionSetAnswers.map((row) => 
          QuestionSetAnswerService.create({
            questionSetId: row.questionSetId,
            questionId: row.questionId,
            answer: row.answer,
            entity: "tender",
            entityId: tender.id,
          }),
        ),
      );
    }

    // TODO: Send tender email to the customer
    return tender;
  }

  static async getTenderById(id: number): Promise<Tender | null> {
    return TenderRepository.findOneBy({ id }, []);
  }

  static async getAllTenders(
    searchParams: SearchTender = {},
    selectFields: (keyof Tender)[] = [],
  ): Promise<Tender[]> {
    return TenderRepository.findAll(searchParams, selectFields);
  }

  static async getTendersByCustomer(customerId: number): Promise<Tender[]> {
    return TenderRepository.findAll({ customerId });
  }

  static async updateTender(
    id: number,
    data: Partial<Tender>,
  ): Promise<Tender> {
    return TenderRepository.updateTender(id, data);
  }

  static async getTendersNearbyByCoordinates(
    data: SearchTendersNearbyByCoordinates,
  ): Promise<Tender[]> {
    return TenderRepository.findAllNearbyByCoordinates(data);
  }

  static async getTendersWithinCoverageDisks(
    disks: ReadonlyArray<CoverageDisk>,
  ): Promise<Tender[]> {
    return TenderRepository.findWithinAnyCoverageDisk(disks);
  }

  static async getTendersForOrganizationCoverage(
    organizationId: number,
  ): Promise<TenderClientListDTO[]> {
    const zones =
      await OrganizationCoverageAreaService.getByOrganization(organizationId);
    const disks: CoverageDisk[] = zones.map((z) => ({
      latitude: z.latitude,
      longitude: z.longitude,
      radiusKm: z.radiusKm,
    }));
    const rows = await TenderRepository.findWithinAnyCoverageDisk(disks);
    return rows.map((t) => this.serializeTenderClientList(t));
  }
}
