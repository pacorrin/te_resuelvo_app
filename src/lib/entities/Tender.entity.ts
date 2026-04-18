import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";
import { Service } from "./Service.entity";

@Entity("tenders")
export class Tender {
  @PrimaryGeneratedColumn({ name: "tend_id" })
  id!: number;

  @Column({ name: "tend_service_id" })
  serviceId!: number;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "tend_service_id" })
  service!: Service;

  @Column({ name: "tend_description", type: "varchar", length: 400 })
  description!: string;

  @Column({ name: "tend_person_name", type: "varchar", length: 150 })
  personName!: string;

  @Column({ name: "tend_person_phone", type: "varchar", length: 15 })
  personPhone!: string;

  @Column({ name: "tend_customer_id" })
  customerId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "tend_customer_id" })
  customer!: User;

  @Column({ name: "tend_tender_address", type: "varchar", length: 200 })
  tenderAddress!: string;

  @Column({ name: "tend_tender_address_reference", type: "varchar", length: 200, nullable: true })
  tenderAddressReference!: string | null;

  @Column({ name: "tend_longitude", type: "varchar", length: 50 })
  longitude!: string;

  @Column({ name: "tend_latitude", type: "varchar", length: 50 })
  latitude!: string;

  @Column({ name: "tend_zipcode", type: "varchar", length: 10 })
  zipcode!: string;

  @CreateDateColumn({ name: "tend_created_at", type: "timestamp" })
  createdAt!: string;
}
