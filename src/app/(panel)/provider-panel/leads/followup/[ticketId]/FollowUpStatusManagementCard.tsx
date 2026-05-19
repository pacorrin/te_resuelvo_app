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
import { Spinner } from "@/src/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import {
  _getServiceTicketQuoteFile,
  _updateTicketStatus,
  _uploadServiceTicketQuote,
} from "@/src/lib/actions/service-tickets.actions";
import { ServiceTicketPaymentsModal } from "./ServiceTicketPaymentsModal";
import type { FileDTO } from "@/src/lib/dtos/File.dto";
import { toastError, toastSuccess } from "@/src/lib/utils";
import { getErrorMessage } from "@/src/lib/utils/error";

function normalizeQuoteFileDto(f: FileDTO): FileDTO {
  return {
    ...f,
    createdAt:
      typeof f.createdAt === "string" ? new Date(f.createdAt) : f.createdAt,
  };
}

const QUOTE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,image/webp";

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
  const quoteInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingQuote, setIsUploadingQuote] = useState(false);
  const [quoteFile, setQuoteFile] = useState<FileDTO | null>(null);
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
      const result = await _getServiceTicketQuoteFile(ticketId);
      if (cancelled) return;
      if (result.success) {
        setQuoteFile(
          result.data != null ? normalizeQuoteFileDto(result.data) : null,
        );
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

  const openQuoteFilePicker = () => {
    quoteInputRef.current?.click();
  };

  const openQuoteInNewTab = () => {
    if (!quoteFile) return;
    window.open(`/api/files/${quoteFile.id}`, "_blank", "noopener,noreferrer");
  };

  const onQuoteFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    setIsUploadingQuote(true);
    try {
      const result = await _uploadServiceTicketQuote(ticketId, picked);
      if (result.success && result.data) {
        setQuoteFile(normalizeQuoteFileDto(result.data));
        toastSuccess(
          `Cotización subida: ${result.data.originalName || "archivo"}.`,
        );
        setStatus(ServiceTicketStatus.QUOTED);
      } else {
        toastError(result.error ?? "No se pudo subir la cotización.");
      }
    } catch {
      toastError("Error al subir el archivo.");
    } finally {
      setIsUploadingQuote(false);
    }
  };

  return (
    <>
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="text-base">Estado del servicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={quoteInputRef}
            type="file"
            accept={QUOTE_ACCEPT}
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={onQuoteFileChange}
          />
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
              onClick={() =>
                quoteFile ? openQuoteInNewTab() : openQuoteFilePicker()
              }
              disabled={isUploadingQuote}
              title={
                quoteFile
                  ? "Abrir la cotización en una pestaña nueva"
                  : "Elegir archivo de cotización"
              }
            >
              {isUploadingQuote ? (
                <Spinner className="mr-2 size-4 shrink-0" />
              ) : quoteFile ? (
                <CheckCircle className="mr-2 size-4 shrink-0 text-green-500" />
              ) : (
                <FileText className="mr-2 h-4 w-4 shrink-0" />
              )}
              {isUploadingQuote
                ? "Subiendo…"
                : quoteFile
                  ? "Ver cotización"
                  : "Subir cotización"}
            </Button>
            {quoteFile ? (
              <button
                type="button"
                className="w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
                onClick={openQuoteFilePicker}
                disabled={isUploadingQuote}
              >
                Subir una cotización nueva
              </button>
            ) : null}
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
