import type { QuestionType } from "@/src/lib/enums/question.enum";

export interface CreateQuestionSetDTO {
  name: string;
  description?: string | null;
  entity: string;
  entityId: number;
}

export interface UpdateQuestionSetDTO {
  name?: string;
  description?: string | null;
  entity?: string;
  entityId?: number;
}

export interface SearchQuestionSet {
  id?: number;
  name?: string;
  entity?: string;
  entityId?: number;
}

export interface QuestionSetClientDTO {
  id: number;
  name: string;
  description: string | null;
  entity: string;
  entityId: number;
  questions: {
    id: number;
    questionText: string;
    questionType: QuestionType;
    options: string[] | null;
    required: boolean;
    sortOrder: number;
  }[];
  createdAt: string;
  updatedAt: string;
}
