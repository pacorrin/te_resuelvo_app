import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Organization } from "./Organization.entity";

@Entity("organization_coverage_areas")
export class OrganizationCoverageArea {
  @PrimaryGeneratedColumn({ name: "orcoar_id" })
  id!: number;

  @Column({ name: "orcoar_organization_id" })
  organizationId!: number;

  @Column({ name: "orcoar_name", type: "varchar", length: 150 })
  name!: string;

  @Column({
    name: "orcoar_latitude",
    type: "decimal",
    precision: 10,
    scale: 8,
  })
  latitude!: number;

  @Column({
    name: "orcoar_longitude",
    type: "decimal",
    precision: 11,
    scale: 8,
  })
  longitude!: number;

  @Column({
    name: "orcoar_radius_km",
    type: "decimal",
    precision: 5,
    scale: 2,
  })
  radiusKm!: number;

  @Column({ name: "orcoar_address", type: "varchar", length: 255, nullable: true })
  address?: string;

  @CreateDateColumn({ name: "orcoar_created_at", type: "timestamp" })
  createdAt!: Date;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "orcoar_organization_id" })
  organization!: Organization;
}
