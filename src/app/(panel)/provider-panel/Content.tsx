import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Separator } from "@/src/components/ui/separator";
import { StatsGroup } from "./StatsGroup";
import { ProviderPanelLeadsTabs } from "./ProviderPanelLeadsTabs";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { auth } from "@/src/lib/auth/auth";
import { OrganizationService } from "@/src/lib/services/organization.service";

export default async function Content() {
  const session = await auth();
  const userId = Number(session?.user?.id);
  let organizationId: number = 0;
  if (Number.isFinite(userId)) {
    try {
      const org = await OrganizationService.getOrganizationByUser(userId);
      organizationId = org.id;
    } catch {
      organizationId = 0;
    }
  }

  return (
    <>
      {/* Stats Section */}
      <StatsGroup />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Leads List */}
        <div className="w-full lg:w-3/4 min-w-0">
          <ProviderPanelLeadsTabs organizationId={organizationId} />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/4 space-y-6 min-w-0">
          {/* How it works */}
          <Card className="bg-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-white">Cómo funciona</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-blue-50">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                    1
                  </span>
                  <span>Revisa los clientes disponibles en tu categoría</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                    2
                  </span>
                  <span>Compra los que te interesen</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                    3
                  </span>
                  <span>Contacta al cliente directamente</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                    4
                  </span>
                  <span>Cierra el negocio</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Pricing info */}
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Precio por lead</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plomería</span>
                  <span className="font-semibold">$15 USD</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Electricidad</span>
                  <span className="font-semibold">$15 USD</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pintura</span>
                  <span className="font-semibold">$12 USD</span>
                </div>
              </div>
              <Separator className="mb-4" />
              <p className="text-xs text-muted-foreground">
                Solo pagas por clientes que decides comprar. Sin suscripciones
                ni costos ocultos.
              </p>
            </CardContent>
          </Card>

          {/* Profile completion */}
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Completa tu perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">80% completado</span>
                  <span className="font-medium">80%</span>
                </div>
                <Progress
                  value={80}
                  className="h-2 bg-zinc-100 dark:bg-zinc-800"
                />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/provider-panel/profile">Completar perfil</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Alert */}
          {/* <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              Créditos bajos
            </AlertTitle>
            <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
              Recarga para no perder oportunidades
            </AlertDescription>
          </Alert> */}
        </div>
      </div>
    </>
  );
}
