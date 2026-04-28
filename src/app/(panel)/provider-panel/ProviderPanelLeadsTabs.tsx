"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { LeadsList } from "./LeadsList";
import { PurchasedLeadsList } from "./PurchasedLeadsList";

export function ProviderPanelLeadsTabs({
  organizationId,
}: {
  organizationId: number;
}) {
  return (
    <Tabs defaultValue="leads" className="w-full min-w-0">
      <TabsList className="w-full max-w-md">
        <TabsTrigger value="leads" className="flex-1">
          Nuevos clientes
        </TabsTrigger>
        <TabsTrigger value="purchased" className="flex-1">
          Clientes comprados
        </TabsTrigger>
      </TabsList>
      <TabsContent value="leads" className="mt-4 outline-none">
        <LeadsList organizationId={organizationId} />
      </TabsContent>
      <TabsContent value="purchased" className="mt-4 outline-none">
        <PurchasedLeadsList organizationId={organizationId} />
      </TabsContent>
    </Tabs>
  );
}
