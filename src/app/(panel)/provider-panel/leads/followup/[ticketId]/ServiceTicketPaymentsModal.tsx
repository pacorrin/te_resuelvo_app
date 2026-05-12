"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { InputNumber } from "@/src/components/ui/input-number";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  _createServiceTicketPayment,
  _listServiceTicketPayments,
} from "@/src/lib/actions/service-tickets.actions";
import { ServiceTicketPaymentBalanceType } from "@/src/lib/enums/service-tickets.enum";
import {
  ServiceTicketPaymentService,
  type ServiceTicketPaymentDTO,
} from "@/src/lib/services/service-ticket-payment.service";
import { cn, toastError, toastSuccess } from "@/src/lib/utils";

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function parseCreatedAt(value: ServiceTicketPaymentDTO["createdAt"]): Date {
  if (value instanceof Date) return value;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function normalizePayments(
  rows: ServiceTicketPaymentDTO[],
): ServiceTicketPaymentDTO[] {
  return rows.map((r) => ({
    ...r,
    amount: Number(r.amount),
    createdAt: parseCreatedAt(r.createdAt),
  }));
}

type ServiceTicketPaymentsModalProps = {
  ticketId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ServiceTicketPaymentsModal({
  ticketId,
  open,
  onOpenChange,
}: ServiceTicketPaymentsModalProps) {
  const [payments, setPayments] = useState<ServiceTicketPaymentDTO[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [balanceType, setBalanceType] = useState<string>(
    String(ServiceTicketPaymentBalanceType.CREDIT),
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const loadPayments = useCallback(async () => {
    setLoadingList(true);
    try {
      const result = await _listServiceTicketPayments(ticketId);
      if (result.success && result.data) {
        setPayments(normalizePayments(result.data));
      } else {
        toastError(result.error ?? "No se pudieron cargar los pagos.");
      }
    } catch {
      toastError("No se pudieron cargar los pagos.");
    } finally {
      setLoadingList(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (!open) return;
    void loadPayments();
  }, [open, loadPayments]);

  const credits = ServiceTicketPaymentService.totalCredits(payments);
  const debits = ServiceTicketPaymentService.totalDebits(payments);
  const net = ServiceTicketPaymentService.netBalance(payments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number.parseFloat(amount.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toastError("Ingresa un monto válido mayor que cero.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await _createServiceTicketPayment(ticketId, {
        balanceType: Number(balanceType) as ServiceTicketPaymentBalanceType,
        amount: parsed,
        description: description.trim() || null,
      });
      if (result.success && result.data) {
        setPayments((prev) => normalizePayments([result.data!, ...prev]));
        setAmount("");
        setDescription("");
        toastSuccess("Movimiento registrado.");
      } else {
        toastError(result.error ?? "No se pudo registrar el movimiento.");
      }
    } catch {
      toastError("No se pudo registrar el movimiento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,90dvh)] overflow-y-auto overscroll-contain sm:max-w-lg">
        <div className="flex w-full flex-col gap-4">
          <DialogHeader className="shrink-0 space-y-2 text-left">
            <DialogTitle>Pagos y cargos del servicio</DialogTitle>
            <DialogDescription>
              Registra abonos (pagos del cliente) y cargos (adeudos o ajustes).
              El saldo es abonos menos cargos.
            </DialogDescription>
          </DialogHeader>

          <div className="shrink-0 rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between gap-2 py-0.5">
              <span className="text-muted-foreground">Total abonos</span>
              <span className="font-medium tabular-nums">
                {formatUsd(credits)}
              </span>
            </div>
            <div className="flex justify-between gap-2 py-0.5">
              <span className="text-muted-foreground">Total cargos</span>
              <span className="font-medium tabular-nums">
                {formatUsd(debits)}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between gap-2 font-semibold">
              <span>Saldo</span>
              <span
                className={cn(
                  "tabular-nums",
                  net >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {formatUsd(net)}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 space-y-3 rounded-lg border bg-background/60 p-3"
          >
            <h3 className="text-sm font-medium">Registrar movimiento</h3>
            <div className="space-y-2">
              <Label htmlFor="pay-type">Tipo</Label>
              <Select value={balanceType} onValueChange={setBalanceType}>
                <SelectTrigger id="pay-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={String(ServiceTicketPaymentBalanceType.CREDIT)}
                  >
                    Abono (pago recibido)
                  </SelectItem>
                  <SelectItem
                    value={String(ServiceTicketPaymentBalanceType.DEBIT)}
                  >
                    Cargo (gasto)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-amount">Monto (USD)</Label>
              <InputNumber
                id="pay-amount"
                allowDecimals
                placeholder="0.00"
                value={amount}
                onValueChange={setAmount}
                max={99_999_999.99}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-desc">Descripción (opcional)</Label>
              <Textarea
                id="pay-desc"
                rows={2}
                maxLength={150}
                placeholder="Ej. Anticipo por cotización"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-right text-xs text-muted-foreground">
                {description.length}/150
              </p>
            </div>
            <DialogFooter className="sm:gap-0">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cerrar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Guardando…
                    </>
                  ) : (
                    "Registrar"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>

          <div className="flex shrink-0 flex-col gap-2">
            <h3 className="text-sm font-medium">Historial de movimientos</h3>
            <div
              className={cn(
                "bg-muted/15",
                "max-h-[min(50vh,380px)] min-h-30 overflow-y-auto overscroll-y-contain",
                "[-webkit-overflow-scrolling:touch]",
              )}
            >
              {loadingList ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Cargando…
                </div>
              ) : payments.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No hay movimientos registrados.
                </p>
              ) : (
                <ul className="space-y-2">
                  {payments.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-col gap-0.5 rounded-sm border bg-background px-3 py-2 text-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "shrink-0 rounded px-1.5 py-0.5 text-xs font-medium",
                            p.balanceType ===
                              ServiceTicketPaymentBalanceType.CREDIT
                              ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
                              : "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
                          )}
                        >
                          {p.balanceType ===
                          ServiceTicketPaymentBalanceType.CREDIT
                            ? "Abono"
                            : "Cargo"}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 font-semibold tabular-nums",
                            p.balanceType ===
                              ServiceTicketPaymentBalanceType.CREDIT
                              ? "text-green-700 dark:text-green-400"
                              : "text-amber-800 dark:text-amber-300",
                          )}
                        >
                          {p.balanceType ===
                          ServiceTicketPaymentBalanceType.CREDIT
                            ? "+"
                            : "−"}
                          {formatUsd(p.amount)}
                        </span>
                      </div>
                      {p.description ? (
                        <p className="text-xs text-muted-foreground">
                          {p.description}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        {parseCreatedAt(p.createdAt).toLocaleString("es-MX", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
