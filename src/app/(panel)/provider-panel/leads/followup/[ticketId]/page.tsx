import LeadClientInformationCard, {
  type LeadClientData,
} from "./LeadClientInformationCard";
import FollowUpServiceDetailsCard from "./FollowUpServiceDetailsCard";
import FollowUpTimelineCard from "./FollowUpTimelineCard";
import FollowUpIncidentsCard from "./FollowUpIncidentsCard";
import FollowUpStatusManagementCard from "./FollowUpStatusManagementCard";
import FollowUpScheduleAppointmentCard from "./FollowUpScheduleAppointmentCard";
import FollowUpCommunicationCenterCard from "./FollowUpCommunicationCenterCard";
import FollowUpRecommendationsCard from "./FollowUpRecommendationsCard";
import FollowUpQuickActionsCard from "./FollowUpQuickActionsCard";
import {
  FollowUpLeadHeaderBadge,
  FollowUpTicketStatusProvider,
} from "./FollowUpTicketStatus";
import { PanelHeader } from "@/src/components/PanelHeader";
import { _getTicketById } from "@/src/lib/actions/service-tickets.actions";
import { getTenderNumber } from "@/src/lib/utils/tender.utils";
import { _getTenderQuestionAnswersForOrgAction } from "@/src/lib/actions/question-set-answer.actions";
import { _listServiceTicketIncidences } from "@/src/lib/actions/service-tickets-incidences.actions";
import { _listServiceTicketStatusHistory } from "@/src/lib/actions/service-ticket-status-history.actions";
import { ServiceTicketStatusHistoryEventType } from "@/src/lib/enums/service-tickets.enum";

function formatFollowUpDate(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function LeadFollowUpPage({
  params,
}: {
  params: Promise<{ ticketId: number }>;
}) {
  const { ticketId: ticketIdParam } = await params;
  const ticketId = Number(ticketIdParam);

  if (!Number.isFinite(ticketId) || ticketId <= 0) {
    return <div>Identificador de ticket inválido: {ticketIdParam}.</div>;
  }

  const ticketResult = await _getTicketById(Number(ticketIdParam));
  const answersResult = await _getTenderQuestionAnswersForOrgAction(
    ticketResult.data?.organizationId ?? 0,
    ticketResult.data?.tender?.id ?? 0,
  );
  if (!ticketResult.success || !ticketResult.data) {
    return <div>{ticketResult.error ?? "Error al cargar el ticket."}</div>;
  }

  const ticket = ticketResult.data;
  const incidencesResult = await _listServiceTicketIncidences(ticketId);
  const initialIncidences =
    incidencesResult.success && incidencesResult.data
      ? incidencesResult.data
      : [];
  const statusHistoryResult = await _listServiceTicketStatusHistory(ticketId);
  const initialStatusHistory =
    statusHistoryResult.success && statusHistoryResult.data
      ? statusHistoryResult.data
      : [];
  const initialVisitCompleted = initialStatusHistory.some(
    (h) => h.eventType === ServiceTicketStatusHistoryEventType.VISIT_COMPLETED,
  );
  const tender = ticket.tender;
  if (!tender) {
    return <div>No se encontró la información del tender.</div>;
  }

  const client: LeadClientData = {
    name: tender.personName,
    phone: tender.personPhone,
    email: tender.customer?.email ?? "",
    address: tender.tenderAddress,
    preferredContact: "WhatsApp",
    latitude: tender.latitude,
    longitude: tender.longitude,
    addressReference: tender.tenderAddressReference ?? "",
  };    

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PanelHeader />

      <FollowUpTicketStatusProvider initialStatus={ticket.status}>
        <main className="flex-1 px-4 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Seguimiento de Lead #{getTenderNumber(tender.id)}
                  </h1>
                  <p className="text-muted-foreground">
                    Gestiona y da seguimiento completo a este servicio
                  </p>
                </div>
                <FollowUpLeadHeaderBadge />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <LeadClientInformationCard client={client} />
                <FollowUpServiceDetailsCard
                  service={tender.service?.name ?? "—"}
                  description={tender.description}
                  requestDate={formatFollowUpDate(tender.createdAt)}
                  scheduledDate={formatFollowUpDate(ticket.serviceScheduledFor)}
                  answers={answersResult.data ?? []}
                />
                <FollowUpTimelineCard
                  initialStatusHistory={initialStatusHistory}
                />
                <FollowUpIncidentsCard
                  ticketId={ticketId}
                  initialIncidences={initialIncidences}
                />
              </div>

              <div className="space-y-6">
                <FollowUpStatusManagementCard ticketId={ticketId} />
                <FollowUpScheduleAppointmentCard
                  key={`${
                    ticket.serviceScheduledFor
                      ? new Date(ticket.serviceScheduledFor).toISOString()
                      : "none"
                  }-${initialVisitCompleted ? "v1" : "v0"}`}
                  ticketId={ticketId}
                  initialScheduledAt={ticket.serviceScheduledFor}
                  initialVisitCompleted={initialVisitCompleted}
                />
                <FollowUpCommunicationCenterCard />
                <FollowUpRecommendationsCard />
                <FollowUpQuickActionsCard client={client} />
              </div>
            </div>
          </div>
        </main>
      </FollowUpTicketStatusProvider>

      <footer className="bg-background border-t px-4 md:px-6 py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 ServiHogar. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
