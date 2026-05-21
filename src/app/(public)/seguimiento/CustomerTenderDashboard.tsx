"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { CustomerTenderOverviewDTO } from "@/src/lib/dtos/CustomerTenderPortal.dto";
import { _logoutCustomerTenderAccess } from "@/src/lib/actions/customer-portal.actions";
import { CustomerTenderRequestCard } from "./CustomerTenderRequestCard";
import { CustomerProviderCards } from "./CustomerProviderCards";

type CustomerTenderDashboardProps = {
  overview: CustomerTenderOverviewDTO;
};

export function CustomerTenderDashboard({ overview }: CustomerTenderDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await _logoutCustomerTenderAccess();
    router.push("/seguimiento");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Seguimiento de tu solicitud
          </h1>
          <p className="text-sm text-muted-foreground">
            Consulta el estado de los proveedores interesados en tu servicio.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => void handleLogout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      <CustomerTenderRequestCard request={overview.request} />
      <CustomerProviderCards providers={overview.providers} />
    </div>
  );
}
