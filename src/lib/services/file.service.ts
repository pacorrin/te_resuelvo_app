import type { FileDTO, CreateFileDTO, UpdateFileDTO } from "@/src/lib/dtos/File.dto";
import { FileEntity } from "@/src/lib/entities/File.entity";
import { FileRepository } from "@/src/lib/repositories/File.repo";
import type { FileOwnerType } from "@/src/lib/storage/storage.enums";

export class FileService {
  static serialize(row: FileEntity): FileDTO {
    return {
      id: row.id,
      originalName: row.originalName,
      storedName: row.storedName,
      relativePath: row.relativePath,
      mimeType: row.mimeType,
      size: String(row.size),
      category: row.category,
      ownerType: row.ownerType,
      ownerId: row.ownerId,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
    };
  }

  static async getById(id: number): Promise<FileDTO | null> {
    const row = await FileRepository.findOneBy(id);
    if (!row) return null;
    return this.serialize(row);
  }

  static async getByOwner(
    ownerType: FileOwnerType,
    ownerId: number,
  ): Promise<FileDTO[]> {
    const rows = await FileRepository.findByOwner(ownerType, ownerId);
    return rows.map((r) => this.serialize(r));
  }

  static async create(data: CreateFileDTO): Promise<FileDTO> {
    const row = await FileRepository.create(data);
    return this.serialize(row);
  }

  static async update(id: number, data: UpdateFileDTO): Promise<FileDTO> {
    const row = await FileRepository.update(id, data);
    return this.serialize(row);
  }

  static async remove(id: number): Promise<void> {
    await FileRepository.remove(id);
  }
}
