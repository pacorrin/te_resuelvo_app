import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream as NodeWebReadableStream } from "node:stream/web";
import { pipeline } from "node:stream/promises";
import crypto from "node:crypto";
import { FileCategory, FileOwnerType } from "./storage.enums";
import { FileService } from "../services/file.service";

type SaveRequestBodyToLocalFileInput = {
  body: ReadableStream<Uint8Array>;
  fileId?: number;
  fileName?: string;
  folder?: string;
  contentType?: string;
  allowExtensions?: string[];
  fileMetadata: {
    category: FileCategory;
    ownerType: FileOwnerType;
    ownerId: number;
  }
};

type StoredFileResult = {
  storedName: string;
  relativePath: string;
  absolutePath: string;
  mimeType: string;
  fileId?: number;
};

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getFileExtension(fileName: string): string {
  return fileName.split(".").pop() || "";
}

function resolveUploadDir(folder = "uploads"): string {
  return path.join(process.cwd(), "storage", folder);
}

export async function saveRequestBodyToLocalFile({
  body,
  fileName,
  folder = "uploads",
  contentType = "application/octet-stream",
  fileMetadata,
  allowExtensions = [],
}: SaveRequestBodyToLocalFileInput): Promise<StoredFileResult> {

  const ext = getFileExtension(fileName || "");
  if (
    allowExtensions.length > 0 && 
    !allowExtensions.map(e => e.toLowerCase()).includes(ext.toLowerCase())
  ) {
    throw new Error("File extension is not allowed");
  }

  if (!fileMetadata.category || !fileMetadata.ownerType || !fileMetadata.ownerId) {
    throw new Error("File metadata is required");
  }

  const uploadDir = resolveUploadDir(folder);
  await fsp.mkdir(uploadDir, { recursive: true });

  const safeName = sanitizeFileName(`${crypto.randomUUID()}.${ext}`);

  const absolutePath = path.join(uploadDir, safeName);
  const nodeReadable = Readable.fromWeb(body as NodeWebReadableStream);
  const writeStream = fs.createWriteStream(absolutePath);

  await pipeline(nodeReadable, writeStream);

  let relativePath = path.join("storage", folder, safeName);
  let size = fs.statSync(absolutePath).size;

  const file = await FileService.create({
    originalName: fileName || "",
    storedName: safeName,
    relativePath: relativePath,
    mimeType: contentType,
    size: size,
    category: fileMetadata.category,
    ownerType: fileMetadata.ownerType,
    ownerId: fileMetadata.ownerId,
  });

  return {
    fileId: file.id,
    storedName: safeName,
    relativePath: path.join("storage", folder, safeName),
    absolutePath: absolutePath,
    mimeType: contentType,
  };
}