export type TenderQuestionAnswerRow = {
  questionText: string;
  answer: string;
};

export type CheckoutTenderBuyerView = {
  organizationId: number;
  tender: {
    id: number;
    description: string;
    zipcode: string;
    createdAt: string;
    service: { name: string; leadPrice: number } | null;
    customer: { name: string | null; email: string; phone: string | null } | null;
  };
  buyer: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  tenderQuestionAnswers: TenderQuestionAnswerRow[];
};
