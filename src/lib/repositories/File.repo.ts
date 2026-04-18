import { getDataSource } from "@/src/lib/db/connection";
import { FileEntity } from "@/src/lib/entities/File.entity";
import { FileOwnerType } from "@/src/lib/storage/storage.enums";
import { Repository } from "typeorm";
import type { CreateFileDTO, UpdateFileDTO } from "../dtos/File.dto";

export class FileRepository {
  private static async getRepo(): Promise<Repository<FileEntity>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("FileEntity");
  }

  static async findOneBy(id: number): Promise<FileEntity | null> {
    const repo = await this.getRepo();
    return repo.findOne({ where: { id } });
  }

  static async findByOwner(
    ownerType: FileOwnerType,
    ownerId: number,
  ): Promise<FileEntity[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ownerType, ownerId },
      order: { id: "DESC" },
    });
  }

  static async create(data: CreateFileDTO): Promise<FileEntity> {
    const repo = await this.getRepo();
    const row = repo.create({
      ...data,
      size: String(data.size),
    });
    return repo.save(row);
  }

  static async update(id: number, data: UpdateFileDTO): Promise<FileEntity> {
    const repo = await this.getRepo();
    const existing = await repo.findOne({ where: { id } });
    if (!existing) {
      throw new Error("File not found");
    }
    const merged = repo.merge(existing, {
      ...data,
      ...(data.size !== undefined ? { size: String(data.size) } : {}),
    } as Partial<FileEntity>);
    return repo.save(merged);
  }

  static async remove(id: number): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete(id);
  }
}
