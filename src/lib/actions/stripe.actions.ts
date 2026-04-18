"use server";

import { headers } from "next/headers";

import { StripeService } from "../services/stripe.service";

export async function _createEmbeddedCheckoutSession(processUuid: string) {
  const origin = (await headers()).get("origin");
  return StripeService.createEmbeddedCheckoutSession(origin, processUuid);
}
