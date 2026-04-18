import { getDataSource } from "@/src/lib/db/connection";
import { QuestionSetAnswer } from "@/src/lib/entities/QuestionSetAnswer.entity";
import { Repository } from "typeorm";
import {
  CreateQuestionSetAnswerDTO,
  SearchQuestionSetAnswer,
  UpdateQuestionSetAnswerDTO,
} from "../dtos/QuestionSetAnswers.dto";

export class QuestionSetAnswerRepository {
  private static async getRepo(): Promise<Repository<QuestionSetAnswer>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("QuestionSetAnswer");
  }

  static async findOneBy(
    searchParams: SearchQuestionSetAnswer,
    select?: (keyof QuestionSetAnswer)[],
  ): Promise<QuestionSetAnswer | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      select,
    });
  }

  static async findAll(
    searchParams: SearchQuestionSetAnswer = {},
    select?: (keyof QuestionSetAnswer)[],
  ): Promise<QuestionSetAnswer[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      select,
      order: { id: "ASC" },
    });
  }

  static async createQuestionSetAnswer(
    data: CreateQuestionSetAnswerDTO,
  ): Promise<QuestionSetAnswer> {
    const repo = await this.getRepo();
    const row = repo.create({
      questionSetId: data.questionSetId,
      questionId: data.questionId,
      answer: data.answer,
      relatedEntity: data.entity,
      relatedEntityId: data.entityId,
    });
    return repo.save(row);
  }

  static async updateQuestionSetAnswer(
    id: number,
    data: UpdateQuestionSetAnswerDTO,
  ): Promise<QuestionSetAnswer> {
    const repo = await this.getRepo();
    const existing = await this.findOneBy({ id });
    if (!existing) {
      throw new Error("Question set answer not found");
    }
    return repo.save({
      ...existing,
      questionSetId:
        data.questionSetId !== undefined ? data.questionSetId : existing.questionSetId,
      questionId: data.questionId !== undefined ? data.questionId : existing.questionId,
      answer: data.answer !== undefined ? data.answer : existing.answer,
      relatedEntity: data.entity !== undefined ? data.entity : existing.relatedEntity,
      relatedEntityId: data.entityId !== undefined ? data.entityId : existing.relatedEntityId,
    });
  }
}
