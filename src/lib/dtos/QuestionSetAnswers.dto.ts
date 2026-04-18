export interface CreateQuestionSetAnswerDTO {
  questionSetId: number;
  questionId: number;
  answer: string;
  entity: string;
  entityId: number;
}

export interface UpdateQuestionSetAnswerDTO {
  questionSetId?: number;
  questionId?: number;
  answer?: string;
  entity?: string;
  entityId?: number;
}

export interface SearchQuestionSetAnswer {
  id?: number;
  questionSetId?: number;
  questionId?: number;
  /** Matches `QuestionSetAnswer.relatedEntity` / `relatedEntityId` for queries */
  relatedEntity?: string;
  relatedEntityId?: number;
}
