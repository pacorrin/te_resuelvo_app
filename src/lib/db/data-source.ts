import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.entity";
import { Tender } from "../entities/Tender.entity";
import { Organization } from "../entities/Organization.entity";
import { OrganizationMember } from "../entities/OrganizationMember.entity";
import { Service } from "../entities/Service.entity";
import { OrganizationService } from "../entities/OrganizationService.entity";
import { OrganizationCoverageArea } from "../entities/OrganizationCoverageArea.entity";
import { FileEntity } from "../entities/File.entity";
import { TenderBuyer } from "../entities/TenderBuyer.entity";
import { QuestionSet } from "../entities/QuestionSet.entity";
import { Question } from "../entities/Question.entity";
import { QuestionSetAnswer } from "../entities/QuestionSetAnswer.entity";
import { ServiceTicket } from "../entities/ServiceTickets.entity";
import { ServiceTicketIncidence } from "../entities/ServiceTicketIncidence.entity";
import { ServiceTicketPayment } from "../entities/ServiceTicketPayment.entity";
import { ServiceTicketStatusHistory } from "../entities/ServiceTicketStatusHistory.entity";
import { ServiceTicketAppointment } from "../entities/ServiceTicketAppointment.entity";
import { stabilizeEntityClassNames } from "./stabilize-entity-class-names";

/** Single source of truth for TypeORM entity registration (app runtime + stale-cache checks). */
const ENTITY_REGISTRY = [
  { entity: User, name: "User" },
  { entity: Tender, name: "Tender" },
  { entity: Organization, name: "Organization" },
  { entity: OrganizationMember, name: "OrganizationMember" },
  { entity: Service, name: "Service" },
  { entity: OrganizationService, name: "OrganizationService" },
  { entity: OrganizationCoverageArea, name: "OrganizationCoverageArea" },
  { entity: FileEntity, name: "FileEntity" },
  { entity: TenderBuyer, name: "TenderBuyer" },
  { entity: QuestionSet, name: "QuestionSet" },
  { entity: Question, name: "Question" },
  { entity: QuestionSetAnswer, name: "QuestionSetAnswer" },
  { entity: ServiceTicket, name: "ServiceTicket" },
  { entity: ServiceTicketIncidence, name: "ServiceTicketIncidence" },
  { entity: ServiceTicketPayment, name: "ServiceTicketPayment" },
  { entity: ServiceTicketStatusHistory, name: "ServiceTicketStatusHistory" },
  { entity: ServiceTicketAppointment, name: "ServiceTicketAppointment" },
] as const;

export const APP_ENTITIES = ENTITY_REGISTRY.map((entry) => entry.entity);

/** Call before DataSource.initialize() so production bundles keep stable entity names. */
export function ensureEntityMetadataReady(): void {
  stabilizeEntityClassNames(ENTITY_REGISTRY);
}

ensureEntityMetadataReady();

let AppDataSourceInstance: DataSource;

try {
  AppDataSourceInstance = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "test",
    /** Interpret and send datetimes as UTC (offset +00:00), not the MySQL server’s local TZ. */
    timezone: "Z",
    logging: process.env.NODE_ENV === "development",
    entities: [...APP_ENTITIES],
    subscribers: [],
  });
} catch (error) {
  console.error("Failed to create AppDataSource:", error);
  throw error;
}

export const AppDataSource = AppDataSourceInstance;
