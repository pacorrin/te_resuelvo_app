import Link from "next/link";
import { CheckCircle2, ClipboardList, Home } from "lucide-react";

import { PanelPage } from "@/src/components/PanelPage";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export default async function ProcessingCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; tender_id?: string }>;
}) {
  const sp = await searchParams;
  const tenderId = Number.parseInt(sp.tender_id ?? "", 10);
  const hasFollowUpTarget = Number.isFinite(tenderId) && tenderId > 0;
  const followUpHref = `/provider-panel/leads/followup/${encodeURIComponent(String(tenderId))}`;

  return (
    <PanelPage>
      <div className="mx-auto max-w-lg">
        <Card className="border-emerald-500/20 bg-emerald-500/3 shadow-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Compra completada
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground pt-1">
              El pago del lead se procesó correctamente. Tu compra quedó
              registrada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="rounded-lg border border-border/80 bg-background/80 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground mb-1.5">¿Qué sigue?</p>
              <p>
                Como <span className="text-foreground">comprador</span> de este
                lead, ya tienes acceso a la{" "}
                <span className="text-foreground">página de seguimiento</span>:
                ahí verás los datos del cliente y podrás llevar el trato desde
                un solo lugar.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:flex-wrap">
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

            {sp.session_id ? (
              <p className="text-center text-xs text-muted-foreground">
                Referencia de sesión:{" "}
                <span className="font-mono break-all">{sp.session_id}</span>
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </PanelPage>
  );
}
