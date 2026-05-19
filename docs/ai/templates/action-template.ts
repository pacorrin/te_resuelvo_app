"use server";

import { protectedAction } from "@/src/lib/protected-action";
import { ExampleService, type ExampleDTO } from "@/src/lib/services/example.service";
import type { ActionResponse } from "@/src/lib/utils/action-response";
import { getErrorMessage } from "@/src/lib/utils/error";

export const _getExampleById = protectedAction(
  async (session, id: number): Promise<ActionResponse<ExampleDTO>> => {
    // if the user id is required for the action, create this constant variable, that validation is not required because protectedAction already validates it
    const userId = Number(session.user.id);

    try {
      const row = await ExampleService.getById(id);
      if (!row) {
        return { success: false, error: "No encontrado." };
      }
      // TODO: membership / ownership checks via domain service
      return { success: true, data: ExampleService.serialize(row) };
    } catch (error) {
      console.error("_getExampleById", error);
      return { success: false, error: getErrorMessage(error) };
    }
  },
);
