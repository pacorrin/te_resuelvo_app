import { TenderRepository } from "@/src/lib/repositories/Tender.repo";
import type { CoverageDisk } from "@/src/lib/repositories/Tender.repo";
import {
  CreateTenderFromPublicSiteDTO,
  SearchTender,
  SearchTendersNearbyByCoordinates,
  TenderFollowUpDTO,
  type AvailableLeadsCoverageStatsDTO,
  type TenderClientListDTO,
} from "../dtos/Tenders.dto";
import { Tender } from "../entities/Tender.entity";
import { UserService } from "./user.service";
import { OrganizationCoverageAreaService } from "./organization-coverage-area.service";
import {
  QuestionSetAnswerService,
  QUESTION_SET_ANSWER_ENTITY_TENDER,
} from "./question-set-answer.service";
import { ServiceTicketRepository } from "../repositories/ServiceTickets.repo";
import { CustomerTenderAccessService } from "./customer-tender-access.service";
import { EmailService } from "./email.service";
import { ServiceRepository } from "../repositories/Service.repo";
import { getTenderNumber } from "../utils/tender.utils";

export class TenderService {
  static serializeTenderClientList(tender: Tender): TenderClientListDTO {
    return {
      id: tender.id,
      serviceId: tender.serviceId,
      description: tender.description,
      personName: tender.personName,
      personPhone: tender.personPhone,
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
        : null
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
    const { email, personPhone, personName, questionSetAnswers, ...tenderData } = data;
    const user = await UserService.createUserFromPublicSite({
      email,
      name: personName,
      phone: personPhone,
    });

    const tender = await TenderRepository.createTender({
      ...tenderData,
      personName,
      personPhone,
      customerId: user?.id,
    });

    let accessCode: string | null = null;
    if (tender.id) {
      accessCode = await CustomerTenderAccessService.assignAccessCodeForTender(
        tender.id,
      );
    }

    if (questionSetAnswers?.length) {
      await Promise.all(
        questionSetAnswers.map((row) => 
          QuestionSetAnswerService.create({
            questionSetId: row.questionSetId,
            questionId: row.questionId,
            answer: row.answer,
            entity: QUESTION_SET_ANSWER_ENTITY_TENDER,
            entityId: tender.id,
          }),
        ),
      );
    }

    if (tender.id && accessCode && email.trim()) {
      const service = await ServiceRepository.findOneBy(
        { id: tender.serviceId },
        ["name"],
      );
      await EmailService.sendCustomerTenderCreated({
        to: email.trim(),
        personName,
        requestNumber: getTenderNumber(tender.id),
        serviceName: service?.name ?? "Servicio solicitado",
        accessCode,
      });
    }

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
    const rows = await TenderRepository.findWithinAnyCoverageDisk(
      disks,
      organizationId,
    );
    return rows.map((t) => this.serializeTenderClientList(t));
  }

  /** Same pool as `getTendersForOrganizationCoverage`, aggregated for dashboard stats. */
  static async getAvailableLeadsCoverageStats(
    organizationId: number,
  ): Promise<AvailableLeadsCoverageStatsDTO> {
    const tenders = await this.getTendersForOrganizationCoverage(organizationId);
    const cutoffMs = Date.now() - 24 * 60 * 60 * 1000;
    let last24h = 0;

    for (const tender of tenders) {
      const createdAt =
        tender.createdAt instanceof Date
          ? tender.createdAt
          : new Date(tender.createdAt);
      if (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getTime() >= cutoffMs
      ) {
        last24h += 1;
      }
    }

    return { total: tenders.length, last24h };
  }
}
