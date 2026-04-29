"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wrench, Check } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Spinner } from "@/src/components/ui/spinner";
import { _initPurchaseProcess } from "@/src/lib/actions/tender-buyer.actions";
import { _getTenderQuestionAnswersForOrgAction } from "@/src/lib/actions/question-set-answer.actions";
import { toast } from "sonner";
import { toastError } from "@/src/lib/utils";

export interface LeadListItemData {
  id: number;
  service: string;
  serviceType: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  phone: string;
  /** Código postal; maps from `Tender.zipcode`. */
  location: string;
  date: string;
  status: "available" | "purchased";
  price: number;
}

function LeadCardContent({
  lead,
  onPurchase,
  showBuyButton = true,
}: {
  lead: LeadListItemData;
  onPurchase: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showBuyButton?: boolean;
}) {
  return (
    <>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <Wrench className="h-4 w-4" />
            </div>
            <h4 className="truncate text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-100">
              {lead.serviceType}
            </h4>
          </div>
          <div className="text-xs ">{lead.service}</div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">{lead.id}</span>
            <span>•</span>
            <span>{lead.date}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-medium whitespace-nowrap text-zinc-400">
            {lead.date}
          </span>
          {lead.status === "available" ? (
            <Badge className="h-5 rounded-md bg-blue-100 px-2 text-[10px] text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
              Disponible
            </Badge>
          ) : (
            <Badge className="h-5 rounded-md bg-emerald-100 px-2 text-[10px] text-emerald-800 flex items-center gap-1 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Check className="h-3.5 w-3.5" />
              Comprado
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold tracking-tight uppercase text-zinc-400">
            Est. Trabajo
          </p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            ${lead.price} <span className="text-[10px]">USD</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {lead.status === "available" ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Cliente oculto ({lead.location})</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>
                  {lead.customer.name} · {lead.location}
                </span>
              </>
            )}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            Tel: {lead.status === "available" ? "Oculto" : lead.phone}
          </p>
        </div>

        {lead.status === "available" && showBuyButton && (
          <Button
            onClick={onPurchase}
            className="inline-flex h-7 items-center rounded-lg bg-blue-600 px-3 text-[10px] font-semibold text-white shadow-sm"
          >
            Adquirir
          </Button>
        )}
      </div>
    </>
  );
}

export function LeadListItemCompact({
  lead,
  organizationId,
  isPurchased,
}: {
  lead: LeadListItemData;
  organizationId: number;
  isPurchased?: boolean;
}) {
  const router = useRouter();
  const [detailOpen, setDetailOpen] = useState(false);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [answers, setAnswers] = useState<
    { questionText: string; answer: string }[] | null
  >(null);

  const handleOpen = () => {
    router.push(
      `/provider-panel/leads/followup/${encodeURIComponent(lead.id)}`,
    );
  };

  const handlePurchase = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await _initPurchaseProcess({
      tenderId: lead.id,
      organizationId: organizationId,
    });
    if (result.success && result.data?.processUuid) {
      router.push(`/provider-panel/checkout/${result.data.processUuid}`);
    } else {
      toastError(result?.error ?? "Error al iniciar el proceso de compra");
    }
  };

  useEffect(() => {
    if (!detailOpen || isPurchased) return;

    let cancelled = false;
    (async () => {
      setAnswersLoading(true);
      setAnswers(null);
      const result = await _getTenderQuestionAnswersForOrgAction(
        organizationId,
        lead.id,
      );
      if (cancelled) return;
      if (result.success && result.data) {
        setAnswers(result.data);
      } else {
        setAnswers([]);
        if (result.error) {
          toast.error(result.error);
        }
      }
      setAnswersLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [detailOpen, isPurchased, organizationId, lead.id]);

  const openDetail = () => {
    if (!isPurchased) setDetailOpen(true);
  };

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={isPurchased ? handleOpen : openDetail}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          if (isPurchased) handleOpen();
          else openDetail();
        }}
        className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-3 transition-all hover:border-blue-400  dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800/60 dark:hover:bg-zinc-900/80"
      >
        <LeadCardContent lead={lead} onPurchase={handlePurchase} />
      </article>

      {!isPurchased ? (
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalle del lead</DialogTitle>
              <DialogDescription>
                Información del servicio y respuestas del formulario.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <LeadCardContent lead={lead} onPurchase={handlePurchase} showBuyButton={false} />
              <Button onClick={handlePurchase} className="w-full mt-2">Adquirir</Button>
            </div>

            <div className="space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Información adicional
              </p>
              {answersLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : answers && answers.length > 0 ? (
                <ul className="space-y-3">
                  {answers.map((row, idx) => (
                    <li
                      key={`${row.questionText}-${idx}`}
                      className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
                      <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {row.questionText}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {row.answer}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No hay respuestas registradas para este lead.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
