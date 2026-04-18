"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { _createEmbeddedCheckoutSession } from "@/src/lib/actions/stripe.actions";
import { Stripe } from "stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

export interface StripeCheckoutProps {
  onLoad?: (stripeSession: Stripe.Checkout.Session) => void;
  processUuid: string;
}

export default function StripeCheckout({ processUuid, onLoad }: StripeCheckoutProps) {
  const handleLoad = async () => {
    const clientSession = await _createEmbeddedCheckoutSession(processUuid);
    if (clientSession) {
      onLoad?.(clientSession);
    }
    return clientSession.client_secret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret: async () => (await handleLoad()) ?? "",
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
