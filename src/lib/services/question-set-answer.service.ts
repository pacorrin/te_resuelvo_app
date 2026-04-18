import { QuestionSetAnswerRepository } from "@/src/lib/repositories/QuestionSetAnswer.repo";
import {
  CreateQuestionSetAnswerDTO,
  SearchQuestionSetAnswer,
  UpdateQuestionSetAnswerDTO,
} from "../dtos/QuestionSetAnswers.dto";
import { QuestionSetAnswer } from "../entities/QuestionSetAnswer.entity";
import { QuestionService } from "./question.service";

/** Stored in `quesa_entity` when the answer belongs to a tender purchase / lead. */
export const QUESTION_SET_ANSWER_ENTITY_TENDER = "tender";

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

  static async findByTenderId(tenderId: number): Promise<QuestionSetAnswer[]> {
    return QuestionSetAnswerRepository.findAll({
      relatedEntity: QUESTION_SET_ANSWER_ENTITY_TENDER,
      relatedEntityId: tenderId,
    });
  }

  /** Answers for checkout / lead summary: question copy + stored answer text. */
  static async getTenderAnswerRows(
    tenderId: number,
  ): Promise<{ questionText: string; answer: string }[]> {
    const answers = await this.findByTenderId(tenderId);
    if (answers.length === 0) return [];

    const questionIds = [...new Set(answers.map((a) => a.questionId))];
    const questions = await Promise.all(
      questionIds.map((id) => QuestionService.getById(id)),
    );
    const byId = new Map(
      questions.filter(Boolean).map((q) => [q!.id, q!]),
    );

    return answers.map((a) => ({
      questionText:
        byId.get(a.questionId)?.questionText?.trim() || "Pregunta",
      answer: a.answer.trim(),
    }));
  }
}
