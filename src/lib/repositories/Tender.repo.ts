import { getDataSource } from "@/src/lib/db/connection";
import { Tender } from "@/src/lib/entities/Tender.entity";
import { Repository } from "typeorm";
import {
  SearchTender,
  CreateTenderDTO,
  SearchTendersNearbyByCoordinates,
} from "../dtos/Tenders.dto";
import { TenderPaymentStatus } from "../enums/tender.enum";

const DEFAULT_NEARBY_RADIUS_KM = 50;

export type CoverageDisk = {
  latitude: number;
  longitude: number;
  radiusKm: number;
};

function haversineKmSql(
  alias: string,
  latParam: string,
  lngParam: string,
): string {
  return `(
    6371 * ACOS(
      LEAST(
        1,
        GREATEST(
          -1,
          COS(RADIANS(:${latParam})) * COS(RADIANS(CAST(${alias}.tend_latitude AS DECIMAL(12, 8)))) *
          COS(RADIANS(CAST(${alias}.tend_longitude AS DECIMAL(12, 8))) - RADIANS(:${lngParam})) +
          SIN(RADIANS(:${latParam})) * SIN(RADIANS(CAST(${alias}.tend_latitude AS DECIMAL(12, 8))))
        )
      )
    )
  )`;
}

export class TenderRepository {
  private static async getRepo(): Promise<Repository<Tender>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("Tender");
  }

  static async findOneBy(
    searchParams: SearchTender,
    select?: (keyof Tender)[],
  ): Promise<Tender | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      select: select || [
        "id",
        "description",
        "personName",
        "personPhone",
        "customerId",
        "tenderAddress",
        "tenderAddressReference",
        "longitude",
        "latitude",
        "zipcode",
        "createdAt",
      ],
    });
  }

  static async findAll(
    searchParams: SearchTender,
    select?: (keyof Tender)[],
  ): Promise<Tender[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      select: select || [
        "id",
        "description",
        "personName",
        "customerId",
        "tenderAddress",
        "tenderAddressReference",
        "longitude",
        "latitude",
        "zipcode",
        "createdAt",
      ],
    });
  }

  static async findAllNearbyByCoordinates(
    data: SearchTendersNearbyByCoordinates,
    radiusKm: number = DEFAULT_NEARBY_RADIUS_KM,
  ): Promise<Tender[]> {
    const repo = await this.getRepo();
    const distanceExpr = haversineKmSql("tender", "lat", "lng");
    let qb = repo
      .createQueryBuilder("tender")
      .where("tender.tend_latitude != '' AND tender.tend_longitude != ''")
      .andWhere(`${distanceExpr} <= :radius`, {
        lat: data.latitude,
        lng: data.longitude,
        radius: radiusKm,
      });

    if (data.organizationId != null) {
      qb = qb.andWhere(
        `NOT EXISTS (
          SELECT 1 FROM tenders_buyers tb
          WHERE tb.tendbu_tender_id = tender.tend_id
            AND tb.tendbu_organization_id = :excludeOrgId
            AND tb.tendbu_payment_status = :paidStatus
        )`,
        {
          excludeOrgId: data.organizationId,
          paidStatus: TenderPaymentStatus.PAID,
        },
      );
    }

    return qb.orderBy(distanceExpr, "ASC").getMany();
  }

  /** Tenders inside any coverage disk; with org id: only that org’s linked services, and exclude paid buyers for that org. */
  static async findWithinAnyCoverageDisk(
    disks: ReadonlyArray<CoverageDisk>,
    organizationId?: number,
  ): Promise<Tender[]> {
    if (disks.length === 0) {
      return [];
    }

    const repo = await this.getRepo();
    const params: Record<string, number> = {};
    const orClauses = disks.map((d, i) => {
      const latKey = `covLat${i}`;
      const lngKey = `covLng${i}`;
      const radKey = `covRad${i}`;
      params[latKey] = d.latitude;
      params[lngKey] = d.longitude;
      params[radKey] = d.radiusKm;
      const dist = haversineKmSql("tender", latKey, lngKey);
      return `${dist} <= :${radKey}`;
    });

    let query = repo
      .createQueryBuilder("tender")
      .leftJoinAndSelect("tender.service", "service") 
      .leftJoinAndSelect("tender.customer", "customer")
      .where("tender.tend_latitude != '' AND tender.tend_longitude != ''")
      .andWhere(`(${orClauses.join(" OR ")})`, params);

    if (organizationId != null) {
      query = query.andWhere(
        `EXISTS (
          SELECT 1 FROM organization_services os
          WHERE os.ser_id = tender.tend_service_id
            AND os.orser_organization_id = :orgId
        )
        AND NOT EXISTS (
          SELECT 1 FROM tenders_buyers tb
          WHERE tb.tendbu_tender_id = tender.tend_id
            AND tb.tendbu_organization_id = :orgId
            AND tb.tendbu_payment_status = :paidStatus
        )`,
        {
          orgId: organizationId,
          paidStatus: TenderPaymentStatus.PAID,
        },
      );
    }

    return query.orderBy("tender.createdAt", "DESC").getMany();
  }

  static async createTender(data: CreateTenderDTO): Promise<Tender> {
    const repo = await this.getRepo();
    const tender = repo.create(data);
    return repo.save(tender);
  }

  static async updateTender(
    id: number,
    data: Partial<Tender>,
  ): Promise<Tender> {
    const repo = await this.getRepo();
    const tender = await this.findOneBy({ id });
    if (!tender) {
      throw new Error("Tender not found");
    }
    const updatedTender = await repo.save({ ...tender, ...data });
    return updatedTender;
  }
}
