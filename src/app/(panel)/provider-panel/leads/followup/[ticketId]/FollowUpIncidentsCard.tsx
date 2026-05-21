"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  File,
  FileText,
  Film,
  Image as ImageIcon,
  Info,
  Paperclip,
  Plus,
  Table2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  createServiceTicketIncidence,
  _listServiceTicketIncidences,
  _listServiceTicketIncidenceEvidenceForTicket,
} from "@/src/lib/actions/service-tickets-incidences.actions";
import type { FileDTO } from "@/src/lib/dtos/File.dto";
import {
  ServiceTicketIncidenceType,
  ServiceTicketStatus,
} from "@/src/lib/enums/service-tickets.enum";
import type { ServiceTicketIncidenceDTO } from "@/src/lib/services/service-ticket-incidence.service";
import { cn, toastError, toastSuccess, toastWarning } from "@/src/lib/utils";
import { Separator } from "@/src/components/ui/separator";
import { useFollowUpTicketStatus } from "./FollowUpTicketStatus";

const DESC_MAX = 255;

const EVIDENCE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.heic,.mp4,.mov,image/*,video/*,application/pdf";

function normalizeFileDto(f: FileDTO): FileDTO {
  return {
    ...f,
    createdAt:
      typeof f.createdAt === "string" ? new Date(f.createdAt) : f.createdAt,
  };
}

function normalizeIncidenceRows(
  rows: ServiceTicketIncidenceDTO[],
): ServiceTicketIncidenceDTO[] {
  return rows.map((r) => ({
    ...r,
    createdAt:
      typeof r.createdAt === "string" ? new Date(r.createdAt) : r.createdAt,
  }));
}

function incidenceTypeSlug(type: ServiceTicketIncidenceType): string {
  switch (type) {
    case ServiceTicketIncidenceType.PROBLEMA:
      return "problema";
    case ServiceTicketIncidenceType.RETRASO:
      return "retraso";
    case ServiceTicketIncidenceType.CANCELACION:
      return "cancelacion";
    case ServiceTicketIncidenceType.NOTA:
    default:
      return "nota";
  }
}

function formatIncidentDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getIncidentIcon(typeSlug: string) {
  switch (typeSlug) {
    case "problema":
      return AlertTriangle;
    case "retraso":
      return Clock;
    case "cancelacion":
      return XCircle;
    case "nota":
      return Info;
    default:
      return Info;
  }
}

function getIncidentForegroundClasses(typeSlug: string) {
  switch (typeSlug) {
    case "problema":
      return "text-red-600 dark:text-red-400";
    case "retraso":
      return "text-yellow-600 dark:text-yellow-400";
    case "cancelacion":
      return "text-red-600 dark:text-red-400";
    case "nota":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-muted-foreground";
  }
}

function getIncidentBackgroundClasses(typeSlug: string) {
  switch (typeSlug) {
    case "problema":
      return "bg-red-100 dark:bg-red-900/30";
    case "retraso":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "cancelacion":
      return "bg-red-100 dark:bg-red-900/30";
    case "nota":
      return "bg-blue-100 dark:bg-blue-900/30";
    default:
      return "bg-muted";
  }
}

function getIncidentLabel(typeSlug: string) {
  switch (typeSlug) {
    case "problema":
      return "Problema";
    case "retraso":
      return "Retraso";
    case "cancelacion":
      return "Cancelación";
    case "nota":
      return "Nota";
    default:
      return typeSlug;
  }
}

type PendingEvidenceKind =
  | "image"
  | "pdf"
  | "word"
  | "excel"
  | "video"
  | "other";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "heic",
  "heif",
  "bmp",
  "svg",
  "avif",
]);

/** Many browsers leave `File.type` empty for some images (e.g. HEIC) or paths. */
function isImageEvidenceFile(file: File): boolean {
  const mime = file.type.toLowerCase();
  if (mime.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS.has(ext);
}

function isImageEvidenceDto(
  f: Pick<FileDTO, "mimeType" | "originalName">,
): boolean {
  const mime = (f.mimeType ?? "").toLowerCase();
  if (mime.startsWith("image/")) return true;
  const ext = f.originalName.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS.has(ext);
}

function classifyPendingEvidenceFile(file: File): PendingEvidenceKind {
  const mime = file.type.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (isImageEvidenceFile(file)) return "image";
  if (
    mime.startsWith("video/") ||
    ["mp4", "mov", "webm", "mkv", "avi"].includes(ext)
  ) {
    return "video";
  }
  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (
    ["doc", "docx", "odt", "rtf"].includes(ext) ||
    mime.includes("wordprocessingml") ||
    mime === "application/msword"
  ) {
    return "word";
  }
  if (
    ["xls", "xlsx", "csv"].includes(ext) ||
    mime.includes("spreadsheetml") ||
    mime.includes("excel")
  ) {
    return "excel";
  }
  return "other";
}

function classifyEvidenceDto(
  f: Pick<FileDTO, "mimeType" | "originalName">,
): PendingEvidenceKind {
  const mime = (f.mimeType ?? "").toLowerCase();
  const ext = f.originalName.split(".").pop()?.toLowerCase() ?? "";
  if (isImageEvidenceDto(f)) return "image";
  if (
    mime.startsWith("video/") ||
    ["mp4", "mov", "webm", "mkv", "avi"].includes(ext)
  ) {
    return "video";
  }
  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (
    ["doc", "docx", "odt", "rtf"].includes(ext) ||
    mime.includes("wordprocessingml") ||
    mime === "application/msword"
  ) {
    return "word";
  }
  if (
    ["xls", "xlsx", "csv"].includes(ext) ||
    mime.includes("spreadsheetml") ||
    mime.includes("excel")
  ) {
    return "excel";
  }
  return "other";
}

const pendingThumbBox =
  "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/60";

function EvidenceTypeIconFromKind({ kind }: { kind: PendingEvidenceKind }) {
  switch (kind) {
    case "image":
      return (
        <div className={pendingThumbBox} title="Imagen">
          <ImageIcon className="h-6 w-6 text-sky-700 dark:text-sky-400" />
        </div>
      );
    case "pdf":
      return (
        <div className={pendingThumbBox} title="PDF">
          <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
      );
    case "word":
      return (
        <div className={pendingThumbBox} title="Documento Word">
          <FileText className="h-6 w-6 text-blue-700 dark:text-blue-400" />
        </div>
      );
    case "excel":
      return (
        <div className={pendingThumbBox} title="Hoja de cálculo">
          <Table2 className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
        </div>
      );
    case "video":
      return (
        <div className={pendingThumbBox} title="Video">
          <Film className="h-6 w-6 text-violet-700 dark:text-violet-400" />
        </div>
      );
    default:
      return (
        <div className={pendingThumbBox} title="Archivo">
          <File className="h-6 w-6 text-muted-foreground" />
        </div>
      );
  }
}

function PendingEvidenceTypeIcon({ file }: { file: File }) {
  return <EvidenceTypeIconFromKind kind={classifyPendingEvidenceFile(file)} />;
}

type FollowUpIncidentsCardProps = {
  ticketId: number;
  initialIncidences: ServiceTicketIncidenceDTO[];
};

export default function FollowUpIncidentsCard({
  ticketId,
  initialIncidences,
}: FollowUpIncidentsCardProps) {
  const router = useRouter();
  const { status: ticketStatusFromCtx } = useFollowUpTicketStatus();
  const ticketStatus = Number(ticketStatusFromCtx) as ServiceTicketStatus;
  const incidentFormLocked =
    ticketStatus === ServiceTicketStatus.COMPLETED ||
    ticketStatus === ServiceTicketStatus.CANCELLED;
  const [incidentType, setIncidentType] = useState<ServiceTicketIncidenceType>(
    ServiceTicketIncidenceType.NOTA,
  );
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidents, setIncidents] = useState<ServiceTicketIncidenceDTO[]>(() =>
    normalizeIncidenceRows(initialIncidences),
  );
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [evidenceByIncidence, setEvidenceByIncidence] = useState<
    Record<number, FileDTO[]>
  >({});
  const [pendingEvidenceFiles, setPendingEvidenceFiles] = useState<File[]>([]);
  const [pendingImagePreviewUrls, setPendingImagePreviewUrls] = useState<
    string[]
  >([]);
  const [failedImagePreviewByKey, setFailedImagePreviewByKey] = useState<
    Record<string, true>
  >({});
  const createFormEvidenceInputRef = useRef<HTMLInputElement>(null);

  // Create blob URLs inside an effect so Strict Mode cleanup does not revoke
  // URLs still referenced from render (useMemo + effect was revoking too early).
  useLayoutEffect(() => {
    setFailedImagePreviewByKey({});
    const urls = pendingEvidenceFiles.map((f) =>
      isImageEvidenceFile(f) ? URL.createObjectURL(f) : "",
    );
    setPendingImagePreviewUrls(urls);
    return () => {
      urls.forEach((u) => {
        if (u) URL.revokeObjectURL(u);
      });
    };
  }, [pendingEvidenceFiles]);

  const incidenceIdsKey = incidents.map((i) => i.id).join(",");

  useEffect(() => {
    setIncidents(normalizeIncidenceRows(initialIncidences));
  }, [initialIncidences]);

  const loadEvidenceForTicket = useCallback(async () => {
    const result = await _listServiceTicketIncidenceEvidenceForTicket(ticketId);
    if (result.success && result.data) {
      const next: Record<number, FileDTO[]> = {};
      for (const bundle of result.data) {
        next[bundle.incidenceId] = bundle.files.map(normalizeFileDto);
      }
      setEvidenceByIncidence(next);
    }
  }, [ticketId]);

  useEffect(() => {
    void loadEvidenceForTicket();
  }, [loadEvidenceForTicket, incidenceIdsKey]);

  const refetchList = async () => {
    setLoadingList(true);
    try {
      const result = await _listServiceTicketIncidences(ticketId);
      if (result.success && result.data) {
        setIncidents(normalizeIncidenceRows(result.data));
        await loadEvidenceForTicket();
      } else if (!result.success) {
        toastError(result.error ?? "No se pudieron cargar las incidencias.");
      }
    } finally {
      setLoadingList(false);
    }
  };

  const openCreateFormEvidencePicker = () => {
    requestAnimationFrame(() => createFormEvidenceInputRef.current?.click());
  };

  const onCreateFormEvidenceFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (incidentFormLocked) {
      e.target.value = "";
      return;
    }
    // `FileList` is live: clearing the input empties it, so snapshot before reset.
    const picked =
      e.target.files && e.target.files.length > 0
        ? Array.from(e.target.files)
        : [];
    e.target.value = "";
    if (picked.length === 0) return;
    setPendingEvidenceFiles((prev) => [...prev, ...picked]);
  };

  const removePendingEvidenceFile = (index: number) => {
    setPendingEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddIncident = async () => {
    if (incidentFormLocked) return;
    const trimmed = incidentDescription.trim();
    if (!trimmed) return;

    const filesToUpload = [...pendingEvidenceFiles];

    setSaving(true);
    try {
      const result = await createServiceTicketIncidence(
        {
          ticketId,
          type: incidentType,
          description: trimmed.slice(0, DESC_MAX),
        },
        filesToUpload,
      );
      if (result.success && result.data) {
        const { incidence, evidenceFiles, evidenceUploadErrors } = result.data;
        const newId = incidence.id;
        const uploaded = evidenceFiles.map(normalizeFileDto);
        const uploadFailures = evidenceUploadErrors.length;

        if (filesToUpload.length > 0 && uploadFailures === 0) {
          toastSuccess("Incidencia y evidencias registradas.");
        } else if (filesToUpload.length > 0 && uploadFailures > 0) {
          toastWarning(
            "Incidencia registrada; algunas evidencias no se pudieron subir.",
          );
          if (evidenceUploadErrors.length > 0) {
            toastError(evidenceUploadErrors.join(" · "));
          }
        } else {
          toastSuccess("Incidencia registrada.");
        }

        setIncidentDescription("");
        setIncidentType(ServiceTicketIncidenceType.NOTA);
        setPendingEvidenceFiles([]);
        const row = normalizeIncidenceRows([incidence])[0];
        setIncidents((prev) => [row, ...prev]);
        if (uploaded.length > 0) {
          setEvidenceByIncidence((prev) => ({
            ...prev,
            [newId]: [...uploaded, ...(prev[newId] ?? [])],
          }));
        }
        await loadEvidenceForTicket();
        router.refresh();
      } else {
        toastError(result.error ?? "No se pudo registrar la incidencia.");
      }
    } catch {
      toastError("No se pudo registrar la incidencia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-secondary" />
            <CardTitle>Incidencias del Servicio</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={() => void refetchList()}
            disabled={loadingList}
          >
            {loadingList ? "Actualizando…" : "Actualizar"}
          </Button>
        </div>
        <CardDescription>
          Documenta problemas, retrasos y notas importantes relacionadas al
          servicio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
              <div className="shrink-0 sm:w-40">
                <Label htmlFor="incident-type" className="text-sm">
                  Tipo
                </Label>
                <Select
                  value={String(incidentType)}
                  onValueChange={(v) =>
                    setIncidentType(Number(v) as ServiceTicketIncidenceType)
                  }
                  disabled={saving || incidentFormLocked}
                >
                  <SelectTrigger
                    id="incident-type"
                    className="mt-1 w-full"
                    disabled={saving || incidentFormLocked}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(ServiceTicketIncidenceType.NOTA)}>
                      Nota
                    </SelectItem>
                    <SelectItem
                      value={String(ServiceTicketIncidenceType.PROBLEMA)}
                    >
                      Problema
                    </SelectItem>
                    <SelectItem
                      value={String(ServiceTicketIncidenceType.RETRASO)}
                    >
                      Retraso
                    </SelectItem>
                    <SelectItem
                      value={String(ServiceTicketIncidenceType.CANCELACION)}
                    >
                      Cancelación
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-0 flex flex-col flex-1 space-y-3">
                <div>
                  <Label htmlFor="incident-description" className="text-sm">
                    Descripción
                  </Label>
                  <Input
                    id="incident-description"
                    placeholder="Describe la incidencia..."
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    maxLength={DESC_MAX}
                    disabled={saving || incidentFormLocked}
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Máximo {DESC_MAX} caracteres
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <input
                ref={createFormEvidenceInputRef}
                type="file"
                multiple
                accept={EVIDENCE_ACCEPT}
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                disabled={incidentFormLocked}
                onChange={onCreateFormEvidenceFilesChange}
              />
              <div className="flex items-center justify-between gap-2">
                <Label className="text-sm">Evidencias (opcional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0"
                  onClick={openCreateFormEvidencePicker}
                  disabled={saving || incidentFormLocked}
                >
                  <Paperclip className="mr-1.5 h-3.5 w-3.5" />
                  Adjuntar archivos
                </Button>
              </div>
              {pendingEvidenceFiles.length > 0 ? (
                <ul className="space-y-2 rounded-md border bg-background/80 p-2 text-sm">
                  {pendingEvidenceFiles.map((f, index) => {
                    const kind = classifyPendingEvidenceFile(f);
                    const previewUrl = pendingImagePreviewUrls[index] ?? "";
                    const fileKey = `${f.name}-${f.size}-${f.lastModified}`;
                    const showImagePreview =
                      kind === "image" &&
                      previewUrl.length > 0 &&
                      !failedImagePreviewByKey[fileKey];
                    return (
                      <li
                        key={`${fileKey}-${index}`}
                        className="flex items-center gap-3 rounded-md border border-transparent bg-background/60 px-1.5 py-1.5 pr-1 hover:border-border/80"
                      >
                        {showImagePreview ? (
                          <div
                            className={cn(
                              pendingThumbBox,
                              "border-primary/20 bg-muted p-0",
                            )}
                          >
                            <img
                              src={previewUrl}
                              alt=""
                              className="size-full object-cover"
                              onError={() =>
                                setFailedImagePreviewByKey((prev) => ({
                                  ...prev,
                                  [fileKey]: true,
                                }))
                              }
                            />
                          </div>
                        ) : (
                          <PendingEvidenceTypeIcon file={f} />
                        )}
                        <span
                          className="min-w-0 flex-1 truncate leading-snug"
                          title={f.name}
                        >
                          {f.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="shrink-0"
                          aria-label={`Quitar ${f.name}`}
                          onClick={() => removePendingEvidenceFile(index)}
                          disabled={saving || incidentFormLocked}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Puedes adjuntar fotos, PDF u otros archivos al crear la
                  incidencia.
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => void handleAddIncident()}
            disabled={
              saving || !incidentDescription.trim() || incidentFormLocked
            }
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {saving ? "Guardando…" : "Agregar incidencia"}
          </Button>
        </div>

        <div className="space-y-3">
          {incidents.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No hay incidencias registradas
            </div>
          ) : (
            incidents.map((incident) => {
              const slug = incidenceTypeSlug(incident.type);
              const IncidentIcon = getIncidentIcon(slug);
              return (
                <div key={incident.id} className="rounded-lg border p-3">
                  <div className="flex gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-col flex-wrap items-start justify-between gap-2 w-full">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                getIncidentBackgroundClasses(slug),
                                getIncidentForegroundClasses(slug),
                              )}
                            >
                              <IncidentIcon className="h-4 w-4" />
                            </div>
                            <div
                              className={cn(
                                "text-sm font-medium",
                                getIncidentForegroundClasses(slug),
                              )}
                            >
                              {getIncidentLabel(slug)}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground">
                            <span className="whitespace-nowrap">
                              {formatIncidentDate(incident.createdAt)}
                            </span>
                            {incident.registeredByName ? (
                              <span className="inline-flex max-w-[12rem] items-center gap-1 truncate sm:max-w-none">
                                <User className="h-3 w-3 shrink-0 text-secondary" />
                                {incident.registeredByName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <p className="text-sm break-words whitespace-pre-wrap">
                          <span
                            className={cn(
                              "text-neutral-400",
                              "text-",
                              getIncidentForegroundClasses(slug),
                            )}
                          >
                            •
                          </span>{" "}
                          {incident.description}
                        </p>
                      </div>
                      {(evidenceByIncidence[incident.id] ?? []).length > 0 ? (
                        <div className="mt-3 space-y-2 border-t pt-3">
                          <p className="text-sm font-medium text-neutral-400">
                            Documentos y Evidencias
                          </p>
                          <ul className="grid grid-cols-3 gap-2">
                            {(evidenceByIncidence[incident.id] ?? []).map(
                              (f) => {
                                const href = `/api/files/${f.id}`;
                                const image = isImageEvidenceDto(f);
                                return (
                                  <li
                                    key={f.id}
                                    className="flex h-44 min-w-0"
                                  >
                                    {image ? (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-full w-full min-w-0 overflow-hidden rounded-md border border-border bg-muted/20 transition-colors hover:border-primary/30"
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
                                        className="flex h-full w-full min-w-0 flex-col rounded-md border border-border bg-muted/20 p-2 text-center transition-colors hover:border-primary/30 hover:bg-muted/40"
                                      >
                                        <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
                                          <EvidenceTypeIconFromKind
                                            kind={classifyEvidenceDto(f)}
                                          />
                                        </div>
                                        <span className="line-clamp-2 w-full shrink-0 text-xs text-foreground wrap-break-word">
                                          {f.originalName}
                                        </span>
                                      </a>
                                    )}
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
