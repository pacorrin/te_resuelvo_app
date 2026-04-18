"use server";
import { ServiceDTO } from "../dtos/Services.dto";
import { QuestionSetClientDTO } from "../dtos/QuestionSets.dto";
import { SearchService } from "../enums/service.enum";
import { protectedAction } from "../protected-action";
import { QuestionSetService } from "../services/question-set.service";
import { ServiceService } from "../services/service.service";
import { ActionResponse } from "../utils/action-response";


export const _findServices = protectedAction(
  async (_, searchParams: SearchService = {}): Promise<ActionResponse<ServiceDTO[]>> => {
    try {
      const services = await ServiceService.findBy(searchParams);
      return { success: true, data: services };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
);

export const _getServiceQuestionSet = async (
  _: unknown,
  serviceId: number
): Promise<ActionResponse<QuestionSetClientDTO | null>> => {
  try {
    const questionSet = await ServiceService.getServiceQuestionSet(serviceId);
    return {
      success: true,
      data: questionSet ? QuestionSetService.serialize(questionSet) : null,
    };
  } catch (error) {
    console.error("Error getting service question set:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};