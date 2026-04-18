import { QuestionSetAnswerRepository } from "@/src/lib/repositories/QuestionSetAnswer.repo";
import {
  CreateQuestionSetAnswerDTO,
  SearchQuestionSetAnswer,
  UpdateQuestionSetAnswerDTO,
} from "../dtos/QuestionSetAnswers.dto";
import { QuestionSetAnswer } from "../entities/QuestionSetAnswer.entity";

export class QuestionSetAnswerService {
  static async getById(id: number): Promise<QuestionSetAnswer | null> {
    return QuestionSetAnswerRepository.findOneBy({ id });
  }

  static async getAll(
    searchParams: SearchQuestionSetAnswer = {},
    selectFields?: (keyof QuestionSetAnswer)[],
  ): Promise<QuestionSetAnswer[]> {
    return QuestionSetAnswerRepository.findAll(searchParams, selectFields);
  }

  static async create(
    data: CreateQuestionSetAnswerDTO,
  ): Promise<QuestionSetAnswer> {
    return QuestionSetAnswerRepository.createQuestionSetAnswer(data);
  }

  static async update(
    id: number,
    data: UpdateQuestionSetAnswerDTO,
  ): Promise<QuestionSetAnswer> {
    return QuestionSetAnswerRepository.updateQuestionSetAnswer(id, data);
  }
}
