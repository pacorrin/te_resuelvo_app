import { getDataSource } from "@/src/lib/db/connection";
import { QuestionSet } from "@/src/lib/entities/QuestionSet.entity";
import { Repository } from "typeorm";
import {
  CreateQuestionSetDTO,
  UpdateQuestionSetDTO,
} from "../dtos/QuestionSets.dto";

type QuestionSetSearchParams = {
  id?: number;
  name?: string;
  entity?: QuestionSet["entity"];
  entityId?: number;
};

export class QuestionSetRepository {
  private static async getRepo(): Promise<Repository<QuestionSet>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("QuestionSet");
  }

  static async findOneBy(
    searchParams: QuestionSetSearchParams,
    select?: (keyof QuestionSet)[],
  ): Promise<QuestionSet | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      select,
    });
  }

  static async findAll(
    searchParams: QuestionSetSearchParams = {},
    select?: (keyof QuestionSet)[],
  ): Promise<QuestionSet[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      select,
    });
  }

  static async findOneByEntity(
    entity: QuestionSet["entity"],
    entityId: number,
    select?: (keyof QuestionSet)[],
  ): Promise<QuestionSet | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { entity, entityId },
      select,
    });
  }

  static async findOneByEntityWithQuestions(
    entity: QuestionSet["entity"],
    entityId: number,
  ): Promise<QuestionSet | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { entity, entityId },
      relations: { questions: true },
      order: { questions: { sortOrder: "ASC", id: "ASC" } },
    });
  }

  static async createQuestionSet(
    data: CreateQuestionSetDTO,
  ): Promise<QuestionSet> {
    const repo = await this.getRepo();
    const row = repo.create({
      name: data.name,
      description: data.description ?? null,
      entity: String(data.entity),
      entityId: data.entityId,
    });
    return repo.save(row);
  }

  static async updateQuestionSet(
    id: number,
    data: UpdateQuestionSetDTO,
  ): Promise<QuestionSet> {
    const repo = await this.getRepo();
    const existing = await this.findOneBy({ id });
    if (!existing) {
      throw new Error("Question set not found");
    }
    return repo.save({
      ...existing,
      ...data,
      entity: data.entity !== undefined ? String(data.entity) : existing.entity,
    });
  }
}
