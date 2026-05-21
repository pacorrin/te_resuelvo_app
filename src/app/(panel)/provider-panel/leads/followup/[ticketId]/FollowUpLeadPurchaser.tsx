import { Phone, ShoppingBag, User } from "lucide-react";
import type { TenderBuyerUserSummaryDTO } from "@/src/lib/dtos/TenderBuyer.dto";

function formatPurchasedAt(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type FollowUpLeadPurchaserProps = {
  purchaser: TenderBuyerUserSummaryDTO;
};

export function FollowUpLeadPurchaser({ purchaser }: FollowUpLeadPurchaserProps) {
  const displayName = purchaser.name?.trim() || "Usuario del equipo";

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border/70 bg-muted/30 px-3 py-2 text-sm">
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <ShoppingBag className="h-3 w-3" />
        Lead comprado por
      </span>
      <span className="hidden h-3.5 w-px shrink-0 bg-border sm:block" aria-hidden />
      <span className="inline-flex min-w-0 items-center gap-1 font-medium text-foreground">
        <User className="h-3.5 w-3.5 shrink-0 text-primary" />
        {displayName}
      </span>
      {purchaser.phone ? (
        <>
          <span className="hidden text-muted-foreground sm:inline" aria-hidden>
            |
          </span>
          <a
            href={`tel:${purchaser.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-3 w-3 shrink-0" />
            {purchaser.phone}
          </a>
        </>
      ) : null}
        <span className="inline text-border" aria-hidden>
          |
        </span>
      <span className="text-muted-foreground">
        Compra: {formatPurchasedAt(purchaser.purchasedAt)}
      </span>
    </div>
  );
}
