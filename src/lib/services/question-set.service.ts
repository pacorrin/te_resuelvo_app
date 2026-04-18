import { QuestionSetRepository } from "@/src/lib/repositories/QuestionSet.repo";
import {
  CreateQuestionSetDTO,
  QuestionSetClientDTO,
  UpdateQuestionSetDTO,
} from "../dtos/QuestionSets.dto";
import { QuestionSet } from "../entities/QuestionSet.entity";
import { QuestionService } from "./question.service";

type QuestionSetSearchParams = {
  id?: number;
  name?: string;
  entity?: string;
  entityId?: number;
};

export class QuestionSetService {
  private static parseOptions(options: string | null): string[] | null {
    if (!options) return null;
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
    } catch {
      return options
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  static serialize(row: QuestionSet): QuestionSetClientDTO {
    return {
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      entity: row.entity,
      entityId: row.entityId,
      questions: (row.questions ?? []).map((question) => ({
        id: question.id,
        questionText: question.questionText,
        questionType: question.questionType,
        options: this.parseOptions(question.options),
        required: question.required,
        sortOrder: question.sortOrder,
      })),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  static async getById(id: number): Promise<QuestionSet | null> {
    return QuestionSetRepository.findOneBy({ id });
  }

  static async getByEntity(
    entity: string,
    entityId: number,
    includeQuestions = false,
  ): Promise<QuestionSet | null> {
    const questionSet = await QuestionSetRepository.findOneByEntity(entity, entityId);
    if (!questionSet) return null;

    if (!includeQuestions) return questionSet;

    const questions = await QuestionService.getAll({ questionSetId: questionSet.id });
    questionSet.questions = questions;
    return questionSet;
  }

  static async getAll(
    searchParams: QuestionSetSearchParams = {},
    selectFields?: (keyof QuestionSet)[],
  ): Promise<QuestionSet[]> {
    return QuestionSetRepository.findAll(searchParams, selectFields);
  }

  static async create(data: CreateQuestionSetDTO): Promise<QuestionSet> {
    return QuestionSetRepository.createQuestionSet(data);
  }

  static async update(
    id: number,
    data: UpdateQuestionSetDTO,
  ): Promise<QuestionSet> {
    return QuestionSetRepository.updateQuestionSet(id, data);
  }
}
