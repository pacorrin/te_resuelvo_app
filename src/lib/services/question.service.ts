import { QuestionRepository } from "@/src/lib/repositories/Question.repo";
import {
  CreateQuestionDTO,
  SearchQuestion,
  UpdateQuestionDTO,
} from "../dtos/Questions.dto";
import { Question } from "../entities/Question.entity";

export class QuestionService {
  static async getById(id: number): Promise<Question | null> {
    return QuestionRepository.findOneBy({ id });
  }

  static async getAll(
    searchParams: SearchQuestion = {},
    selectFields?: (keyof Question)[],
  ): Promise<Question[]> {
    return QuestionRepository.findAll(searchParams, selectFields);
  }

  static async create(data: CreateQuestionDTO): Promise<Question> {
    return QuestionRepository.createQuestion(data);
  }

  static async update(id: number, data: UpdateQuestionDTO): Promise<Question> {
    return QuestionRepository.updateQuestion(id, data);
  }
}
