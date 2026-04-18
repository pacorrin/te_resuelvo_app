"use client";

import { useMemo } from "react";
import { Stripe } from "stripe";

import StripeCheckout from "@/src/components/StripeCheckout";
import type { LeadListItemData } from "@/src/app/(panel)/provider-panel/LeadListItemCompact";
import CheckoutLeadSummary from "./CheckoutLeadSummary";
import type { CheckoutTenderBuyerView } from "./checkout-view";

export default function CheckoutContent({
  processUUID,
  tenderBuyer,
  error,
}: {
  processUUID: string;
  tenderBuyer: CheckoutTenderBuyerView | null;
  error: string | null;
}) {
  const leadData: LeadListItemData | null = useMemo(() => {
    if (!tenderBuyer) return null;

    const tender = tenderBuyer.tender;
    const buyer = tenderBuyer.buyer;

    return {
      id: tender.id,
      service: tender.description ?? "Servicio",
      serviceType: tender.service?.name ?? "Servicio",
      client: buyer.name ?? buyer.email ?? "Cliente",
      phone: buyer.phone ?? "",
      location: tender.zipcode ?? "",
      date: tender.createdAt
        ? (() => {
            const d = new Date(tender.createdAt);
            const pad = (n: number) => n.toString().padStart(2, "0");
            const day = pad(d.getDate());
            const month = pad(d.getMonth() + 1);
            const year = d.getFullYear();
            let hours = d.getHours();
            const minutes = pad(d.getMinutes());
            const seconds = pad(d.getSeconds());
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 becomes 12
            const hourStr = pad(hours);
            return `${day}/${month}/${year} ${hourStr}:${minutes}:${seconds} ${ampm}`;
          })()
        : "",
      status: "available",
      price: Number(tender.service?.leadPrice ?? 0),
      customer: {
        name: tender.customer?.name ?? "",
        email: tender.customer?.email ?? "",
        phone: tender.customer?.phone ?? "",
      },
    };
  }, [tenderBuyer]);

  const handleLoad = async (stripeSession: Stripe.Checkout.Session) => {
    console.log(stripeSession);
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Completa tu pago
      </h1>

      <div className="flex  w-full gap-6 ">
        <div className="flex w-2/3 flex-col gap-4 rounded-lg bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          {/* <h2 className="text-lg font-bold text-secondary">Detalles del lead</h2> */}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
          {!error && leadData && tenderBuyer && (
            <CheckoutLeadSummary lead={leadData} customer={leadData.customer} />
          )}
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3 dark:bg-blue-950/30 dark:border-blue-900/40">
          <div>
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-300 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1a4 4 0 10-4-4 4 4 0 004 4zm1 8a6 6 0 01-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-blue-700 dark:text-blue-300 mb-1">¿Qué sucede después de adquirir el lead?</h3>
            <p className="text-sm text-blue-900 dark:text-blue-200">
              Una vez que hayas comprado el lead, toda la información relevante del cliente será revelada. 
              Además, tendrás acceso completo al módulo de <span className="font-semibold">seguimiento</span> para gestionar el proceso con este lead, comunicarte y realizar el seguimiento de forma eficiente.
            </p>
          </div>
        </div>
        </div>

        <div className="w-1/3 rounded-lg bg-white p-4 border border-zinc-200 dark:border-zinc-800">
          <StripeCheckout onLoad={handleLoad} processUuid={processUUID} />
        </div>
      </div>
    </>
  );
}

