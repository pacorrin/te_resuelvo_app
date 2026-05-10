"use client";

import { useEffect, useRef, useState } from "react";
import { useFollowUpTicketStatus } from "./FollowUpTicketStatus";
import { CheckCircle, DollarSign, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
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
import type { FileDTO } from "@/src/lib/dtos/File.dto";
import { toastError, toastSuccess } from "@/src/lib/utils";

function normalizeQuoteFileDto(f: FileDTO): FileDTO {
  return {
    ...f,
    createdAt:
      typeof f.createdAt === "string" ? new Date(f.createdAt) : f.createdAt,
  };
}

const QUOTE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,image/webp";

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

  const handleStatusChange = async (value: string) => {
    const nextStatus = Number(value) as ServiceTicketStatus;
    const result = await _updateTicketStatus(ticketId, nextStatus);
    if (result.success) {
      setStatus(nextStatus);
    } else {
      toastError(result.error ?? "No se pudo actualizar el estado del ticket.");
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
          <Select value={String(status)} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {status == ServiceTicketStatus.PENDING && (
                <SelectItem value={ServiceTicketStatus.PENDING.toString()}>
                  Pendiente
                </SelectItem>
              )}
              <SelectItem value={ServiceTicketStatus.CONTACTED.toString()}>
                Contactado
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.QUOTED.toString()}>
                Cotizado
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.IN_PROGRESS.toString()}>
                En progreso
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.COMPLETED.toString()}>
                Completado
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.CANCELLED.toString()}>
                Cancelado
              </SelectItem>
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
          <Button variant="outline" size="sm" className="w-full justify-start">
            <DollarSign className="mr-2 h-4 w-4" />
            Registrar pago
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
