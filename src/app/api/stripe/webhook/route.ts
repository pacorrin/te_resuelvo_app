import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/src/lib/stripe";
import { TenderBuyerService } from "@/src/lib/services/tender-buyer.service";
import { TenderPaymentStatus } from "@/src/lib/enums/tender.enum";
import { ServiceTicketService } from "@/src/lib/services/service-tickets.service";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";

export const runtime = "nodejs";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const payload = await request.text();
  let event: Stripe.Event;

  if (endpointSecret) {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new NextResponse("Missing stripe-signature header", { status: 400 });
    }

    try {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown signature verification error";
      console.log("Webhook signature verification failed.", errorMessage);
      return new NextResponse("Webhook Error", { status: 400 });
    }
  } else {
    event = JSON.parse(payload) as Stripe.Event;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const processUuid = checkoutSession.metadata?.process_uuid;

      if (!processUuid) {
        return new NextResponse("Missing process UUID", { status: 400 });
      }

      await TenderBuyerService.markAsPaid({
        processUuid,
        paymentReceiptNumber: checkoutSession?.id,
        paymentTaxAmount: Number((checkoutSession?.total_details?.amount_tax ?? 0) / 100),
        paymentAmount: Number((checkoutSession?.amount_total ?? 0) / 100),
      });

      const tenderBuyer = await TenderBuyerService.getTenderBuyerByProcessUuid(processUuid);
      if (!tenderBuyer) {
        return new NextResponse("Tender buyer not found", { status: 400 });
      }

      await ServiceTicketService.create({
        tenderId: tenderBuyer.tender.id,
        organizationId: tenderBuyer.organizationId,
        status: ServiceTicketStatus.OPEN,
      });

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  return NextResponse.json({ received: true });
}
