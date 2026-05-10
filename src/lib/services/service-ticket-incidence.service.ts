import type { CreateServiceTicketIncidenceInput } from "@/src/lib/dtos/ServiceTicketIncidence.dto";
import type { FileDTO } from "@/src/lib/dtos/File.dto";
import { ServiceTicketIncidence } from "@/src/lib/entities/ServiceTicketIncidence.entity";
import { ServiceTicketIncidenceType } from "@/src/lib/enums/service-tickets.enum";
import { ServiceTicketIncidenceRepository } from "@/src/lib/repositories/ServiceTicketIncidence.repo";
import { saveRequestBodyToLocalFile } from "@/src/lib/storage/local-storage.service";
import { FileCategory, FileOwnerType } from "@/src/lib/storage/storage.enums";
import { FileService } from "./file.service";

export interface ServiceTicketIncidenceDTO {
  id: number;
  ticketId: number;
  type: ServiceTicketIncidenceType;
  description: string;
  createdAt: Date;
}

export interface ServiceTicketIncidenceEvidenceBundleDTO {
  incidenceId: number;
  files: FileDTO[];
}

export interface ServiceTicketIncidenceCreateResult {
  incidence: ServiceTicketIncidenceDTO;
  evidenceFiles: FileDTO[];
  /** One entry per failed file (e.g. file name or short reason). */
  evidenceUploadErrors: string[];
}

export class ServiceTicketIncidenceService {
  static serialize(row: ServiceTicketIncidence): ServiceTicketIncidenceDTO {
    return {
      id: row.id,
      ticketId: row.ticketId,
      type: row.type,
      description: row.description,
      createdAt: row.createdAt,
    };
  }

  static async listByTicket(
    ticketId: number,
  ): Promise<ServiceTicketIncidenceDTO[]> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return [];
    const rows = await ServiceTicketIncidenceRepository.findAllByTicketId(
      ticketId,
      [],
    );
    return rows.map((r) => this.serialize(r));
  }

  static async create(
    ticketId: number,
    input: Omit<CreateServiceTicketIncidenceInput, "ticketId">,
    evidenceFiles: File[] = [],
  ): Promise<ServiceTicketIncidenceCreateResult | null> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return null;

    const row = await ServiceTicketIncidenceRepository.create({
      ticketId,
      type: input.type,
      description: input.description,
    });
    const incidence = this.serialize(row);

    const evidenceUploaded: FileDTO[] = [];
    const evidenceUploadErrors: string[] = [];

    for (const file of evidenceFiles) {
      try {
        const dto = await this.uploadEvidence(row.id, file);
        evidenceUploaded.push(dto);
      } catch (e) {
        const label = file.name?.trim() || "archivo";
        const msg = e instanceof Error ? e.message : String(e);
        evidenceUploadErrors.push(`${label}: ${msg}`);
      }
    }

    return {
      incidence,
      evidenceFiles: evidenceUploaded,
      evidenceUploadErrors,
    };
  }

  static async listEvidenceBundlesForTicket(
    ticketId: number,
  ): Promise<ServiceTicketIncidenceEvidenceBundleDTO[]> {
    if (!Number.isFinite(ticketId) || ticketId <= 0) return [];
    const incidences = await ServiceTicketIncidenceRepository.findAllByTicketId(
      ticketId,
      [],
    );
    const bundles: ServiceTicketIncidenceEvidenceBundleDTO[] = [];
    for (const inc of incidences) {
      const files = await FileService.getByOwner(
        FileOwnerType.SERVICE_TICKET_INCIDENCE,
        inc.id,
      );
      bundles.push({ incidenceId: inc.id, files });
    }
    return bundles;
  }

  /** Evidence file linked to `tickin_id` via `files.file_ownerId`. */
  static async uploadEvidence(
    incidenceId: number,
    file: File,
  ): Promise<FileDTO> {
    const inc = await ServiceTicketIncidenceRepository.findOneBy(
      { id: incidenceId },
      [],
    );
    if (!inc) {
      throw new Error("Incidence not found");
    }

    const result = await saveRequestBodyToLocalFile({
      body: file.stream() as ReadableStream<Uint8Array>,
      fileName: file.name,
      folder: "service-tickets/incidence-evidence",
      contentType: file.type || "application/octet-stream",
      allowExtensions: [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "jpg",
        "jpeg",
        "png",
        "webp",
        "heic",
        "mp4",
        "mov",
      ],
      fileMetadata: {
        category: FileCategory.EVIDENCE,
        ownerType: FileOwnerType.SERVICE_TICKET_INCIDENCE,
        ownerId: incidenceId,
      },
    });

    if (result.fileId == null) {
      throw new Error("Failed to persist file record");
    }

    const dto = await FileService.getById(result.fileId);
    if (!dto) {
      throw new Error("File record missing");
    }
    return dto;
  }
}
