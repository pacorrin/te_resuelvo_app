import type { FileCategory, FileOwnerType } from "../storage/storage.enums";

export interface FileDTO {
  id: number;
  originalName: string;
  storedName: string;
  relativePath: string;
  mimeType: string;
  /** Stored as DB `bigint` (serialized as string for safety). */
  size: string;
  category: FileCategory;
  ownerType: FileOwnerType;
  ownerId: number;
  createdBy?: number | null;
  createdAt: Date;
}

export interface CreateFileDTO {
  originalName: string;
  storedName: string;
  relativePath: string;
  mimeType: string;
  size: string | number;
  category: FileCategory;
  ownerType: FileOwnerType;
  ownerId: number;
  createdBy?: number | null;
}

export interface UpdateFileDTO {
  originalName?: string;
  storedName?: string;
  relativePath?: string;
  mimeType?: string;
  size?: string | number;
  category?: FileCategory;
  ownerType?: FileOwnerType;
  ownerId?: number;
  createdBy?: number | null;
}
