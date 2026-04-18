import type Stripe from "stripe";

import { stripe } from "../stripe";
import { TenderBuyerService } from "./tender-buyer.service";

export class StripeService {
  static serializeStripeCheckoutSession(
    session: any
  ) {
    return {
      ...session,
    };
  }

 
  static async createEmbeddedCheckoutSession(
    origin: string | null,
    processUuid: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const tenderBuyer = await TenderBuyerService.getTenderBuyerByProcessUuid(processUuid);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: tenderBuyer.buyer.email,
      ui_mode: "embedded_page",
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        processUuid: processUuid,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            tax_behavior: "inclusive",
            product_data: {
              name: `Lead - ${tenderBuyer.tender.service.name}`,
            },
            unit_amount: tenderBuyer.tender.service.leadPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${origin ?? ""}/provider-panel/leads/purchased?session_id={CHECKOUT_SESSION_ID}&tender_id=${tenderBuyer.tenderId}`,
    });

    if (!session.client_secret) {
      throw new Error("Failed to create checkout session");
    }

    return this.serializeStripeCheckoutSession(session) as Stripe.Response<Stripe.Checkout.Session>;
  }
}
