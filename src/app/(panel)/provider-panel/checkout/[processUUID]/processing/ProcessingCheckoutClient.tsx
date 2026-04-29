"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, Home } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TenderPaymentStatus } from "@/src/lib/enums/tender.enum";

type PaymentStatusResponse = {
  success: boolean;
  paymentStatus?: number;
  tenderId?: number;
  error?: string;
};

type ProcessingCheckoutClientProps = {
  processUUID: string;
  sessionId?: string;
  initialTenderId?: string;
};

export default function ProcessingCheckoutClient({
  processUUID,
  sessionId,
  initialTenderId,
}: ProcessingCheckoutClientProps) {
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedTenderId, setResolvedTenderId] = useState<number | null>(null);

  const tenderIdFromQuery = Number.parseInt(initialTenderId ?? "", 10);
  const tenderId =
    Number.isFinite(tenderIdFromQuery) && tenderIdFromQuery > 0
      ? tenderIdFromQuery
      : resolvedTenderId;
  const hasFollowUpTarget = tenderId != null && tenderId > 0;
  const followUpHref = useMemo(
    () =>
      `/provider-panel/leads/followup/${encodeURIComponent(String(tenderId ?? ""))}`,
    [tenderId],
  );

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/checkout/${encodeURIComponent(processUUID)}/status`,
          { cache: "no-store" },
        );
        const data = (await response.json()) as PaymentStatusResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.error || "No se pudo consultar el estado del pago.");
        }

        if (cancelled) return;

        if (data.tenderId && data.tenderId > 0) {
          setResolvedTenderId(data.tenderId);
        }

        if (data.paymentStatus === TenderPaymentStatus.PAID) {
          setProcessing(false);
          setError(null);
          return;
        }

        timer = setTimeout(checkStatus, 3000);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Error consultando el pago.");
        timer = setTimeout(checkStatus, 3000);
      }
    };

    checkStatus();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [processUUID]);

  if (processing) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center">
        <Spinner className="size-10" />
        <p className="mt-3 text-sm text-muted-foreground">Procesando tu pago</p>
        {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card className="border-emerald-500/20 bg-emerald-500/3 shadow-sm">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Compra completada
          </CardTitle>
          <CardDescription className="pt-1 text-base text-muted-foreground">
            El pago del lead se procesó correctamente. Tu compra quedó registrada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <div className="rounded-lg border border-border/80 bg-background/80 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            <p className="mb-1.5 font-medium text-foreground">¿Qué sigue?</p>
            <p>
              Como <span className="text-foreground">comprador</span> de este lead,
              ya tienes acceso a la{" "}
              <span className="text-foreground">página de seguimiento</span>: ahí
              verás los datos del cliente y podrás llevar el trato desde un solo
              lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href={followUpHref}>
                <ClipboardList className="mr-2 h-4 w-4" />
                Ir al seguimiento del lead
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/provider-panel">
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio del panel
              </Link>
            </Button>
          </div>

          {!hasFollowUpTarget ? (
            <p className="text-center text-sm text-muted-foreground">
              Para abrir el seguimiento de este lead, ve al inicio del panel y
              ábrelo desde tu lista de oportunidades.
            </p>
          ) : null}

          {sessionId ? (
            <p className="text-center text-xs text-muted-foreground">
              Referencia de sesión:{" "}
              <span className="break-all font-mono">{sessionId}</span>
            </p>
          ) : null}
          <p className="text-center text-xs text-muted-foreground">
            Proceso: <span className="break-all font-mono">{processUUID}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
