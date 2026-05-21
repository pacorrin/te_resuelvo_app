"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  File,
  FileText,
  Loader2,
  Paperclip,
  Table2,
  Trash2,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Separator } from "@/src/components/ui/separator";
import { Spinner } from "@/src/components/ui/spinner";
import {
  _deleteServiceTicketQuote,
  _listServiceTicketQuoteFiles,
  _uploadServiceTicketQuote,
} from "@/src/lib/actions/service-tickets.actions";
import type { FileDTO } from "@/src/lib/dtos/File.dto";
import { cn, toastError, toastSuccess } from "@/src/lib/utils";
import {
  classifyQuoteFile,
  isQuoteImage,
  normalizeQuoteFileDto,
  QUOTE_ACCEPT,
  type QuoteFileKind,
} from "./quote-file.utils";

const thumbBox =
  "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/60";

function QuoteTypeIcon({ kind }: { kind: QuoteFileKind }) {
  switch (kind) {
    case "pdf":
      return (
        <div className={thumbBox} title="PDF">
          <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
      );
    case "word":
      return (
        <div className={thumbBox} title="Documento Word">
          <FileText className="h-6 w-6 text-blue-700 dark:text-blue-400" />
        </div>
      );
    case "excel":
      return (
        <div className={thumbBox} title="Hoja de cálculo">
          <Table2 className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
        </div>
      );
    default:
      return (
        <div className={thumbBox} title="Archivo">
          <File className="h-6 w-6 text-muted-foreground" />
        </div>
      );
  }
}

type ServiceTicketQuotesModalProps = {
  ticketId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoted?: () => void;
  onQuotesChange?: (count: number) => void;
};

export function ServiceTicketQuotesModal({
  ticketId,
  open,
  onOpenChange,
  onQuoted,
  onQuotesChange,
}: ServiceTicketQuotesModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quotes, setQuotes] = useState<FileDTO[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FileDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!open || loadingList) return;
    onQuotesChange?.(quotes.length);
  }, [open, loadingList, quotes.length, onQuotesChange]);

  const loadQuotes = useCallback(async () => {
    setLoadingList(true);
    try {
      const result = await _listServiceTicketQuoteFiles(ticketId);
      if (result.success && result.data) {
        const normalized = result.data.map(normalizeQuoteFileDto);
        setQuotes(normalized);
      } else {
        toastError(result.error ?? "No se pudieron cargar las cotizaciones.");
      }
    } catch {
      toastError("No se pudieron cargar las cotizaciones.");
    } finally {
      setLoadingList(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (!open) return;
    void loadQuotes();
  }, [open, loadQuotes]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    setUploading(true);
    let uploadedAny = false;
    try {
      for (const file of picked) {
        const result = await _uploadServiceTicketQuote(ticketId, file);
        if (result.success && result.data) {
          const normalized = normalizeQuoteFileDto(result.data);
          setQuotes((prev) => [normalized, ...prev]);
          toastSuccess(
            `Cotización subida: ${result.data.originalName || "archivo"}.`,
          );
          if (!uploadedAny) {
            onQuoted?.();
            uploadedAny = true;
          }
        } else {
          toastError(
            result.error ??
              `No se pudo subir ${file.name || "el archivo"}.`,
          );
        }
      }
    } catch {
      toastError("Error al subir archivos.");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const result = await _deleteServiceTicketQuote(
        ticketId,
        deleteTarget.id,
      );
      if (result.success) {
        setQuotes((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        toastSuccess("Cotización eliminada.");
        setDeleteTarget(null);
      } else {
        toastError(result.error ?? "No se pudo eliminar la cotización.");
      }
    } catch {
      toastError("No se pudo eliminar la cotización.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[min(90vh,90dvh)] overflow-y-auto overscroll-contain sm:max-w-lg">
          <div className="flex w-full flex-col gap-4">
            <DialogHeader className="shrink-0 space-y-2 text-left">
              <DialogTitle>Cotizaciones</DialogTitle>
              <DialogDescription>
                Sube y consulta las cotizaciones de este servicio. Puedes
                adjuntar varios archivos (PDF, Office o imágenes).
              </DialogDescription>
            </DialogHeader>

            <div className="shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={QUOTE_ACCEPT}
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                disabled={uploading}
                onChange={onFilesSelected}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={openFilePicker}
                disabled={uploading}
              >
                {uploading ? (
                  <Spinner className="mr-2 size-4 shrink-0" />
                ) : (
                  <Paperclip className="mr-2 size-4 shrink-0" />
                )}
                {uploading ? "Subiendo…" : "Agregar archivos"}
              </Button>
            </div>

            <Separator />

            <div className="flex shrink-0 flex-col gap-2">
              <h3 className="text-sm font-medium">Archivos subidos</h3>
              <div
                className={cn(
                  "bg-muted/15",
                  "max-h-[min(50vh,380px)] min-h-30 overflow-y-auto overscroll-y-contain",
                  "[-webkit-overflow-scrolling:touch]",
                )}
              >
                {loadingList ? (
                  <div className="flex items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Cargando…
                  </div>
                ) : quotes.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Aún no hay cotizaciones subidas.
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {quotes.map((f) => {
                      const href = `/api/files/${f.id}`;
                      const image = isQuoteImage(f);
                      const kind = classifyQuoteFile(f);
                      return (
                        <li
                          key={f.id}
                          className="group relative flex min-w-0 flex-col"
                        >
                          {image ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block h-36 w-full min-w-0 overflow-hidden rounded-md border border-border bg-muted/20 transition-colors hover:border-primary/30"
                            >
                              <img
                                src={href}
                                alt={f.originalName}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            </a>
                          ) : (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={f.originalName}
                              className="flex h-36 w-full min-w-0 flex-col rounded-md border border-border bg-muted/20 p-2 text-center transition-colors hover:border-primary/30 hover:bg-muted/40"
                            >
                              <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
                                <QuoteTypeIcon kind={kind} />
                              </div>
                              <span className="line-clamp-2 w-full shrink-0 text-xs text-foreground wrap-break-word">
                                {f.originalName}
                              </span>
                            </a>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1.5 right-1.5 size-7 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                            aria-label={`Eliminar ${f.originalName}`}
                            onClick={() => setDeleteTarget(f)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                          {image ? (
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                              {f.originalName}
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(next) => {
          if (!next) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta cotización?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará el archivo{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.originalName}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? "Eliminando…" : "Eliminar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
