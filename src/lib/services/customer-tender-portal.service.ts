import type {
  CustomerAppointmentDTO,
  CustomerProviderProgressDTO,
  CustomerQuoteFileDTO,
  CustomerTenderOptionDTO,
  CustomerTenderOverviewDTO,
  CustomerTenderRequestDTO,
} from "@/src/lib/dtos/CustomerTenderPortal.dto";
import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";
import { FileOwnerType } from "@/src/lib/storage/storage.enums";
import { TenderRepository } from "@/src/lib/repositories/Tender.repo";
import { ServiceTicketRepository } from "@/src/lib/repositories/ServiceTickets.repo";
import { getTenderNumber } from "@/src/lib/utils/tender.utils";
import {
  customerAppointmentStatusLabel,
  customerServiceStatusLabel,
} from "@/src/lib/utils/customer-portal-status";
import { FileService } from "./file.service";
import { QuestionSetAnswerService } from "./question-set-answer.service";
import { ServiceTicketAppointmentService } from "./service-ticket-appointment.service";

function formatRequestDate(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatInstant(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function serializeQuoteFile(
  f: Awaited<ReturnType<typeof FileService.getByOwner>>[number],
): CustomerQuoteFileDTO {
  return {
    id: f.id,
    originalName: f.originalName,
    mimeType: f.mimeType,
    createdAt:
      f.createdAt instanceof Date
        ? f.createdAt.toISOString()
        : String(f.createdAt),
  };
}

function serializeAppointment(
  row: Awaited<
    ReturnType<typeof ServiceTicketAppointmentService.listByTicket>
  >[number],
): CustomerAppointmentDTO {
  return {
    scheduledAt: formatInstant(row.scheduledAt),
    status: row.status,
    statusLabel: customerAppointmentStatusLabel(row.status),
    description: row.description,
  };
}

export class CustomerTenderPortalService {
  static async listTenderOptions(
    customerId: number,
  ): Promise<CustomerTenderOptionDTO[]> {
    const tenders = await TenderRepository.findAllByCustomerId(customerId, [
      "service",
    ]);
    return tenders.map((t) => ({
      tenderId: t.id,
      requestNumber: getTenderNumber(t.id),
      serviceName: t.service?.name ?? "—",
      createdAt:
        typeof t.createdAt === "string"
          ? t.createdAt
          : new Date(t.createdAt).toISOString(),
    }));
  }

  static async getOverview(
    tenderId: number,
    customerId?: number,
  ): Promise<CustomerTenderOverviewDTO> {
    const tenderRow = await TenderRepository.findByIdWithRelations(tenderId);
    if (!tenderRow) {
      throw new Error("Solicitud no encontrada.");
    }
    if (
      customerId != null &&
      Number.isFinite(customerId) &&
      tenderRow.customerId !== customerId
    ) {
      throw new Error("No tienes acceso a esta solicitud.");
    }

    const questionAnswers =
      await QuestionSetAnswerService.getTenderAnswerRows(tenderId);

    const request: CustomerTenderRequestDTO = {
      requestNumber: getTenderNumber(tenderRow.id),
      serviceName: tenderRow.service?.name ?? "—",
      description: tenderRow.description,
      requestDate: formatRequestDate(tenderRow.createdAt),
      personName: tenderRow.personName,
      personPhone: tenderRow.personPhone,
      email: tenderRow.customer?.email ?? "—",
      address: tenderRow.tenderAddress,
      addressReference: tenderRow.tenderAddressReference ?? null,
      zipcode: tenderRow.zipcode,
      questionAnswers,
    };

    const tickets = await ServiceTicketRepository.findAll(
      { tenderId },
      ["organization"],
    );

    const providers: CustomerProviderProgressDTO[] = await Promise.all(
      tickets.map(async (ticket) => {
        const appointments = (
          await ServiceTicketAppointmentService.listByTicket(ticket.id)
        )
          .filter((a) => a.status !== ServiceTicketAppointmentStatus.CANCELLED)
          .map(serializeAppointment);

        const quoteFiles = await FileService.getByOwner(
          FileOwnerType.SERVICE_TICKET_QUOTE,
          ticket.id,
        );
        const quotes = quoteFiles
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map(serializeQuoteFile);

        return {
          organizationName: ticket.organization?.name ?? "Proveedor",
          contactEmail: ticket.organization?.contactEmail ?? "—",
          phone: ticket.organization?.phone ?? "—",
          status: ticket.status,
          statusLabel: customerServiceStatusLabel(ticket.status),
          appointments,
          quotes,
        };
      }),
    );

    return { request, providers };
  }
}
