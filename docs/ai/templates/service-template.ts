import type { ExampleEntity } from "@/src/lib/entities/ExampleEntity.entity";
import {
  ExampleRepository,
  type SearchExample,
  type CreateExampleInput,
  type UpdateExampleInput,
} from "@/src/lib/repositories/Example.repo";

/** Shape returned to UI — no raw entities when siblings serialize. */
export interface ExampleDTO {
  id: number;
  // TODO: fields safe for client
}

export class ExampleService {
  static serialize(entity: ExampleEntity): ExampleDTO {
    return {
      id: entity.id,
      // TODO: map fields
    };
  }

  static async getById(id: number): Promise<ExampleEntity | null> {
    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }
    return ExampleRepository.findOneBy({ id }, []);
  }

  /** Orchestrate domain rules; call other services/repos as needed. */
  static async createThing(input: CreateExampleInput): Promise<ExampleDTO> {
    const row = await ExampleRepository.create(input);
    return this.serialize(row);
  }

  static async updateThing(
    id: number,
    patch: UpdateExampleInput,
  ): Promise<ExampleDTO> {
    const row = await ExampleRepository.update(id, patch);
    return this.serialize(row);
  }

  static async listBy(search: SearchExample = {}): Promise<ExampleDTO[]> {
    const rows = await ExampleRepository.findAll(search, []);
    return rows.map((r) => this.serialize(r));
  }
}
