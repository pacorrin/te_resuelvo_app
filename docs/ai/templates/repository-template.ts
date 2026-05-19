import { getDataSource } from "@/src/lib/db/connection";
import { ExampleEntity } from "@/src/lib/entities/ExampleEntity.entity";
import { Repository } from "typeorm";

/** Narrow search shape for findOne/findAll (repo-local is OK). */
export interface SearchExample {
  id?: number;
}

export interface CreateExampleInput {
  // TODO: required fields for insert
}

export interface UpdateExampleInput {
  // TODO: optional patch fields
}

export class ExampleRepository {
  private static async getRepo(): Promise<Repository<ExampleEntity>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository(ExampleEntity);
  }

  static async findOneBy(
    searchParams: SearchExample,
    relations: string[] = [],
  ): Promise<ExampleEntity | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findAll(
    searchParams: SearchExample = {},
    relations: string[] = [],
  ): Promise<ExampleEntity[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      relations,
      order: { id: "DESC" },
    });
  }

  static async create(data: CreateExampleInput): Promise<ExampleEntity> {
    const repo = await this.getRepo();
    const row = repo.create({
      // TODO: map CreateExampleInput -> entity fields
    });
    return repo.save(row);
  }

  static async update(
    id: number,
    data: UpdateExampleInput,
  ): Promise<ExampleEntity> {
    const repo = await this.getRepo();
    const existing = await this.findOneBy({ id });
    if (!existing) {
      throw new Error("Example not found");
    }
    const patch: Partial<ExampleEntity> = {};
    // TODO: if (data.foo !== undefined) patch.foo = data.foo;
    return repo.save({ ...existing, ...patch });
  }
}
