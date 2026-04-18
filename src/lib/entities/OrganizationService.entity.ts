import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Organization } from "./Organization.entity";
import { Service } from "./Service.entity";

@Entity("organization_services")
export class OrganizationService {
  @PrimaryGeneratedColumn({ name: "orser_id" })
  id!: number;

  @Column({ name: "orser_organization_id" })
  organizationId!: number;

  @Column({ name: "ser_id" })
  serviceId!: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "orser_organization_id" })
  organization!: Organization;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "ser_id" })
  service!: Service;
}
