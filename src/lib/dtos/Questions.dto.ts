import type { QuestionType } from "@/src/lib/enums/question.enum";

export interface CreateQuestionDTO {
  questionSetId: number;
  questionText: string;
  questionType: QuestionType;
  options?: string | null;
  required?: boolean;
  sortOrder?: number;
}

export interface UpdateQuestionDTO {
  questionSetId?: number;
  questionText?: string;
  questionType?: QuestionType;
  options?: string | null;
  required?: boolean;
  sortOrder?: number;
}

export interface SearchQuestion {
  id?: number;
  questionSetId?: number;
  questionType?: QuestionType;
}
