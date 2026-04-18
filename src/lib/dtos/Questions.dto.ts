export interface CreateQuestionDTO {
  questionSetId: number;
  questionText: string;
  questionType: string;
  options?: string | null;
  required?: boolean;
  sortOrder?: number;
}

export interface UpdateQuestionDTO {
  questionSetId?: number;
  questionText?: string;
  questionType?: string;
  options?: string | null;
  required?: boolean;
  sortOrder?: number;
}

export interface SearchQuestion {
  id?: number;
  questionSetId?: number;
  questionType?: string;
}
