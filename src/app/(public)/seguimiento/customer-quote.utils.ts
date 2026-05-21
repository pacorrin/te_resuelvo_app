import type { CustomerQuoteFileDTO } from "@/src/lib/dtos/CustomerTenderPortal.dto";

export type CustomerQuoteFileKind = "image" | "pdf" | "word" | "excel" | "other";

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
]);

export function classifyCustomerQuoteFile(
  f: Pick<CustomerQuoteFileDTO, "mimeType" | "originalName">,
): CustomerQuoteFileKind {
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

export function isCustomerQuoteImage(
  f: Pick<CustomerQuoteFileDTO, "mimeType" | "originalName">,
): boolean {
  return classifyCustomerQuoteFile(f) === "image";
}

export function customerQuoteFileHref(fileId: number): string {
  return `/api/customer/files/${fileId}`;
}
