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
    entities: [
      User,
      Tender,
      Organization,
      OrganizationMember,
      Service,
      OrganizationService,
      OrganizationCoverageArea,
      FileEntity,
      TenderBuyer,
      QuestionSet,
      Question,
      QuestionSetAnswer,
      ServiceTicket,
    ],
    subscribers: [],
  });
} catch (error) {
  console.error("Failed to create AppDataSource:", error);
  throw error;
}

export const AppDataSource = AppDataSourceInstance;

