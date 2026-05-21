import type { FileDTO } from "@/src/lib/dtos/File.dto";

export const QUOTE_ACCEPT =
  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,image/webp";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "heic",
  "heif",
]);

export type QuoteFileKind = "image" | "pdf" | "word" | "excel" | "other";

export function normalizeQuoteFileDto(f: FileDTO): FileDTO {
  return {
    ...f,
    createdAt:
      typeof f.createdAt === "string" ? new Date(f.createdAt) : f.createdAt,
  };
}

export function classifyQuoteFile(
  f: Pick<FileDTO, "mimeType" | "originalName">,
): QuoteFileKind {
  const mime = (f.mimeType ?? "").toLowerCase();
  const ext = f.originalName.split(".").pop()?.toLowerCase() ?? "";
  if (mime.startsWith("image/") || IMAGE_EXTENSIONS.has(ext)) return "image";
  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (
    ["doc", "docx"].includes(ext) ||
    mime.includes("wordprocessingml") ||
    mime === "application/msword"
  ) {
    return "word";
  }
  if (
    ["xls", "xlsx"].includes(ext) ||
    mime.includes("spreadsheetml") ||
    mime.includes("excel")
  ) {
    return "excel";
  }
  return "other";
}

export function isQuoteImage(
  f: Pick<FileDTO, "mimeType" | "originalName">,
): boolean {
  return classifyQuoteFile(f) === "image";
}
