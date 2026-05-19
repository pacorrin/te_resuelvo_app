"use server";
import { ServiceDTO } from "../dtos/Services.dto";
import { QuestionSetClientDTO } from "../dtos/QuestionSets.dto";
import { SearchService } from "../enums/service.enum";
import { protectedAction } from "../protected-action";
import { QuestionSetService } from "../services/question-set.service";
import { ServiceService } from "../services/service.service";
import { ActionResponse } from "../utils/action-response";
import { getErrorMessage } from "../utils/error";

export async function _getServicesFromPublicSite(): Promise<
  ActionResponse<ServiceDTO[]>
> {
  try {
    const services = await ServiceService.findBy({});
    return { success: true, data: services };
  } catch (error) {
    console.error("Error loading services for public site:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export const _findServices = protectedAction(
  async (_, searchParams: SearchService = {}): Promise<ActionResponse<ServiceDTO[]>> => {
    try {
      const services = await ServiceService.findBy(searchParams);
      return { success: true, data: services };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  },
);

export async function _getServiceQuestionSet(
  serviceId: number,
): Promise<ActionResponse<QuestionSetClientDTO | null>> {
  if (!Number.isFinite(serviceId) || serviceId <= 0) {
    return { success: false, error: "Identificador de servicio inválido." };
  }
  try {
    const questionSet = await ServiceService.getServiceQuestionSet(serviceId);
    return {
      success: true,
      data: questionSet ? QuestionSetService.serialize(questionSet) : null,
    };
  } catch (error) {
    console.error("Error getting service question set:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}