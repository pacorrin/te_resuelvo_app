import { getDataSource } from "@/src/lib/db/connection";
import { Question } from "@/src/lib/entities/Question.entity";
import { Repository } from "typeorm";
import {
  CreateQuestionDTO,
  SearchQuestion,
  UpdateQuestionDTO,
} from "../dtos/Questions.dto";

export class QuestionRepository {
  private static async getRepo(): Promise<Repository<Question>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("Question");
  }

  static async findOneBy(
    searchParams: SearchQuestion,
    select?: (keyof Question)[],
  ): Promise<Question | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      select,
    });
  }

  static async findAll(
    searchParams: SearchQuestion = {},
    select?: (keyof Question)[],
  ): Promise<Question[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      select,
      order: { sortOrder: "ASC", id: "ASC" },
    });
  }

  static async createQuestion(data: CreateQuestionDTO): Promise<Question> {
    const repo = await this.getRepo();
    const row = repo.create({
      questionSetId: data.questionSetId,
      questionText: data.questionText,
      questionType: data.questionType,
      options: data.options ?? null,
      required: data.required ?? false,
      sortOrder: data.sortOrder ?? 0,
    });
    return repo.save(row);
  }

  static async updateQuestion(
    id: number,
    data: UpdateQuestionDTO,
  ): Promise<Question> {
    const repo = await this.getRepo();
    const existing = await this.findOneBy({ id });
    if (!existing) {
      throw new Error("Question not found");
    }
    return repo.save({ ...existing, ...data });
  }
}
