import { Badge } from "@/src/components/ui/badge";
import LeadClientInformationCard, {
  type LeadClientData,
} from "./LeadClientInformationCard";
import FollowUpServiceDetailsCard from "./FollowUpServiceDetailsCard";
import FollowUpTimelineCard from "./FollowUpTimelineCard";
import FollowUpIncidentsCard from "./FollowUpIncidentsCard";
import FollowUpStatusManagementCard from "./FollowUpStatusManagementCard";
import FollowUpCommunicationCenterCard from "./FollowUpCommunicationCenterCard";
import FollowUpRecommendationsCard from "./FollowUpRecommendationsCard";
import FollowUpQuickActionsCard from "./FollowUpQuickActionsCard";
import {
  getLeadFollowUpStatusBadgeClass,
  getLeadFollowUpStatusLabel,
} from "./followUpLeadStatus";
import { PanelHeader } from "@/src/components/PanelHeader";
import { _getTicketById } from "@/src/lib/actions/service-tickets.actions";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import { getTenderNumber } from "@/src/lib/utils/tender.utils";

function serviceTicketStatusToWorkflow(status: ServiceTicketStatus): string {
  switch (status) {
    case ServiceTicketStatus.OPEN:
      return "in-progress";
    case ServiceTicketStatus.CONTACTED:
      return "contacted";
    case ServiceTicketStatus.IN_PROGRESS:
      return "in-progress";
    case ServiceTicketStatus.QUOTED:
      return "quoted";
    case ServiceTicketStatus.COMPLETED:
      return "completed";
    case ServiceTicketStatus.CANCELLED:
      return "cancelled";
    default:
      return "in-progress";
  }
}

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
  params: Promise<{ tenderId: string }>;
}) {
  const { tenderId: ticketIdParam } = await params;
  const ticketId = Number(ticketIdParam);

  if (!Number.isFinite(ticketId) || ticketId <= 0) {
    return <div>Identificador de ticket inválido.</div>;
  }

  const ticketResult = await _getTicketById(ticketId);
  if (!ticketResult.success || !ticketResult.data) {
    return (
      <div>
        {ticketResult.error ?? "Error al cargar el ticket."}
      </div>
    );
  }

  const ticket = ticketResult.data;
  const tender = ticket.tender;
  if (!tender) {
    return <div>No se encontró la información del tender.</div>;
  }

  const workflowStatus = serviceTicketStatusToWorkflow(ticket.status);

  const client: LeadClientData = {
    name: tender.personName,
    phone: tender.personPhone,
    email: tender.customer?.email ?? "",
    address: tender.tenderAddress,
    preferredContact: "WhatsApp",
    latitude: tender.latitude,
    longitude: tender.longitude,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PanelHeader />

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
              <Badge
                variant="default"
                className={`${getLeadFollowUpStatusBadgeClass(workflowStatus)} text-white px-6 py-2 text-lg font-semibold`}
              >
                {getLeadFollowUpStatusLabel(workflowStatus)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <LeadClientInformationCard client={client} />
              <FollowUpServiceDetailsCard
                service={tender.service?.name ?? "—"}
                description={tender.description}
                requestDate={formatFollowUpDate(tender.createdAt)}
                scheduledDate={formatFollowUpDate(ticket.serviceScheduledFor)}
              />
              <FollowUpTimelineCard />
              <FollowUpIncidentsCard />
            </div>

            <div className="space-y-6">
              <FollowUpStatusManagementCard initialStatus={workflowStatus} />
              <FollowUpCommunicationCenterCard />
              <FollowUpRecommendationsCard />
              <FollowUpQuickActionsCard client={client} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-background border-t px-4 md:px-6 py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 ServiHogar. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
