import { getDataSource } from "@/src/lib/db/connection";
import { Tender } from "@/src/lib/entities/Tender.entity";
import { Repository } from "typeorm";
import {
  SearchTender,
  CreateTenderDTO,
  SearchTendersNearbyByCoordinates,
} from "../dtos/Tenders.dto";

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
    return repo
      .createQueryBuilder("tender")
      .where("tender.tend_latitude != '' AND tender.tend_longitude != ''")
      .andWhere(`${distanceExpr} <= :radius`, {
        lat: data.latitude,
        lng: data.longitude,
        radius: radiusKm,
      })
      .orderBy(distanceExpr, "ASC")
      .getMany();
  }

  /**
   * Tenders whose coordinates fall inside at least one coverage disk (center + radius).
   * Used to match public tenders against an organization's coverage zones.
   */
  static async findWithinAnyCoverageDisk(
    disks: ReadonlyArray<CoverageDisk>,
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
    .andWhere(`(${orClauses.join(" OR ")})`, params)
    .orderBy("tender.createdAt", "DESC");

    return query.getMany();
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
