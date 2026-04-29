"use server";

import { OrganizationMemberRepository } from "@/src/lib/repositories/OrganizationMember.repo";
import { QuestionSetAnswerService } from "@/src/lib/services/question-set-answer.service";
import { ActionResponse } from "@/src/lib/utils/action-response";
import { getErrorMessage } from "@/src/lib/utils/error";
import { protectedAction } from "@/src/lib/protected-action";

export type TenderQuestionAnswerRow = {
  questionText: string;
  answer: string;
};

export const _getTenderQuestionAnswersForOrgAction = protectedAction(
  async (
    session,
    organizationId: number,
    tenderId: number,
  ): Promise<ActionResponse<TenderQuestionAnswerRow[]>> => {
    try {
      const userId = Number(session.user?.id);
      if (!Number.isFinite(userId)) {
        return { success: false, error: "Sesión inválida" };
      }

      const membership = await OrganizationMemberRepository.findOneBy({
        userId,
        organizationId,
      });
      if (!membership) {
        return {
          success: false,
          error: "No tienes acceso a esta organización.",
        };
      }

      const rows = await QuestionSetAnswerService.getTenderAnswerRows(tenderId);
      return { success: true, data: rows };
    } catch (error) {
      console.error("Error fetching tender question answers:", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);
