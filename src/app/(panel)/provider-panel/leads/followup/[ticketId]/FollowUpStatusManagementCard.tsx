"use client";

import { useEffect, useRef, useState } from "react";
import { useFollowUpTicketStatus } from "./FollowUpTicketStatus";
import { CheckCircle, DollarSign, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import {
  _listServiceTicketQuoteFiles,
  _updateTicketStatus,
} from "@/src/lib/actions/service-tickets.actions";
import { ServiceTicketPaymentsModal } from "./ServiceTicketPaymentsModal";
import { ServiceTicketQuotesModal } from "./ServiceTicketQuotesModal";
import { toastError } from "@/src/lib/utils";
import { getErrorMessage } from "@/src/lib/utils/error";

/** Forward-only order for the service lifecycle (excludes cancel). */
const SERVICE_STATUS_PIPELINE: ServiceTicketStatus[] = [
  ServiceTicketStatus.PENDING,
  ServiceTicketStatus.CONTACTED,
  ServiceTicketStatus.QUOTED,
  ServiceTicketStatus.IN_PROGRESS,
  ServiceTicketStatus.COMPLETED,
];

function serviceStatusLabel(s: ServiceTicketStatus): string {
  switch (s) {
    case ServiceTicketStatus.PENDING:
      return "Pendiente";
    case ServiceTicketStatus.CONTACTED:
      return "Contactado";
    case ServiceTicketStatus.QUOTED:
      return "Cotizado";
    case ServiceTicketStatus.IN_PROGRESS:
      return "En progreso";
    case ServiceTicketStatus.COMPLETED:
      return "Completado";
    case ServiceTicketStatus.CANCELLED:
      return "Cancelado";
    default:
      return String(s);
  }
}

function selectableStatusesForLinearProcess(
  current: ServiceTicketStatus,
): ServiceTicketStatus[] {
  if (
    current === ServiceTicketStatus.COMPLETED ||
    current === ServiceTicketStatus.CANCELLED
  ) {
    return [current];
  }
  const idx = SERVICE_STATUS_PIPELINE.indexOf(current);
  if (idx < 0) {
    return [current, ServiceTicketStatus.CANCELLED];
  }
  return [
    ...SERVICE_STATUS_PIPELINE.slice(idx),
    ServiceTicketStatus.CANCELLED,
  ];
}

type FollowUpStatusManagementCardProps = {
  ticketId: number;
};

export default function FollowUpStatusManagementCard({
  ticketId,
}: FollowUpStatusManagementCardProps) {
  const { status, setStatus } = useFollowUpTicketStatus();
  const [quoteCount, setQuoteCount] = useState(0);
  const [quotesModalOpen, setQuotesModalOpen] = useState(false);
  const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
  const [terminalConfirmOpen, setTerminalConfirmOpen] = useState(false);
  const [pendingTerminalStatus, setPendingTerminalStatus] =
    useState<ServiceTicketStatus | null>(null);
  const [confirmingTerminal, setConfirmingTerminal] = useState(false);
  const prevTerminalDialogOpenRef = useRef(false);

  useEffect(() => {
    if (prevTerminalDialogOpenRef.current && !terminalConfirmOpen) {
      setPendingTerminalStatus(null);
      setConfirmingTerminal(false);
    }
    prevTerminalDialogOpenRef.current = terminalConfirmOpen;
  }, [terminalConfirmOpen]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await _listServiceTicketQuoteFiles(ticketId);
      if (cancelled) return;
      if (result.success && result.data) {
        setQuoteCount(result.data.length);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  const ticketStatus = Number(status) as ServiceTicketStatus;
  const statusSelectLocked =
    ticketStatus === ServiceTicketStatus.COMPLETED ||
    ticketStatus === ServiceTicketStatus.CANCELLED;
  const selectableStatuses =
    selectableStatusesForLinearProcess(ticketStatus);

  const applyStatusUpdate = async (
    nextStatus: ServiceTicketStatus,
  ): Promise<boolean> => {
    try {
      const result = await _updateTicketStatus(ticketId, nextStatus);
      if (result && result.success === true) {
        setStatus(nextStatus);
        return true;
      }
      toastError(
        result?.error ?? "No se pudo actualizar el estado del ticket.",
      );
      return false;
    } catch (e) {
      toastError(getErrorMessage(e));
      return false;
    }
  };

  const handleStatusChange = (value: string) => {
    if (statusSelectLocked) return;
    if (value === "") return;
    const nextStatus = Number(value) as ServiceTicketStatus;
    if (!Number.isFinite(nextStatus)) return;
    if (
      nextStatus === ServiceTicketStatus.COMPLETED ||
      nextStatus === ServiceTicketStatus.CANCELLED
    ) {
      setPendingTerminalStatus(nextStatus);
      setTerminalConfirmOpen(true);
      return;
    }
    void applyStatusUpdate(nextStatus);
  };

  const confirmPendingTerminalStatus = async () => {
    if (pendingTerminalStatus == null) return;
    setConfirmingTerminal(true);
    try {
      const ok = await applyStatusUpdate(pendingTerminalStatus);
      if (ok) {
        setTerminalConfirmOpen(false);
        setPendingTerminalStatus(null);
      }
    } finally {
      setConfirmingTerminal(false);
    }
  };

  return (
    <>
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="text-base">Estado del servicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select
              value={String(ticketStatus)}
              onValueChange={handleStatusChange}
              disabled={statusSelectLocked}
            >
              <SelectTrigger
                id="status"
                className="w-full min-w-0"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectableStatuses.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {serviceStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setQuotesModalOpen(true)}
            >
              {quoteCount > 0 ? (
                <CheckCircle className="mr-2 size-4 shrink-0 text-green-500" />
              ) : (
                <FileText className="mr-2 h-4 w-4 shrink-0" />
              )}
              {quoteCount > 0
                ? `Cotizaciones (${quoteCount})`
                : "Subir cotización"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setPaymentsModalOpen(true)}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Registrar pago
            </Button>
          </div>
        </CardContent>
      </Card>
      <ServiceTicketQuotesModal
        ticketId={ticketId}
        open={quotesModalOpen}
        onOpenChange={setQuotesModalOpen}
        onQuoted={() => setStatus(ServiceTicketStatus.QUOTED)}
        onQuotesChange={setQuoteCount}
      />
      <ServiceTicketPaymentsModal
        ticketId={ticketId}
        open={paymentsModalOpen}
        onOpenChange={setPaymentsModalOpen}
      />

      <AlertDialog
        open={terminalConfirmOpen}
        onOpenChange={setTerminalConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingTerminalStatus === ServiceTicketStatus.COMPLETED
                ? "¿Marcar el servicio como completado?"
                : "¿Cancelar este servicio?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingTerminalStatus === ServiceTicketStatus.COMPLETED
                ? "El ticket quedará en estado Completado. Esta acción no se puede deshacer desde aquí."
                : "El ticket quedará en estado Cancelado. Esta acción no se puede deshacer desde aquí."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmingTerminal}>
              Volver
            </AlertDialogCancel>
            <Button
              type="button"
              variant={
                pendingTerminalStatus === ServiceTicketStatus.CANCELLED
                  ? "destructive"
                  : "default"
              }
              disabled={confirmingTerminal || pendingTerminalStatus == null}
              onClick={() => void confirmPendingTerminalStatus()}
            >
              {confirmingTerminal
                ? "Guardando…"
                : pendingTerminalStatus === ServiceTicketStatus.COMPLETED
                  ? "Sí, completar"
                  : "Sí, cancelar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
