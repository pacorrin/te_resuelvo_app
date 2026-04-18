import { PanelPage } from "@/src/components/PanelPage";
import { TenderBuyerService } from "@/src/lib/services/tender-buyer.service";
import { getErrorMessage } from "@/src/lib/utils/error";
import CheckoutContent from "./CheckoutContent";
import type { CheckoutTenderBuyerView } from "./checkout-view";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ processUUID: string }>;
}) {
  const { processUUID } = await params;

  let tenderBuyer: CheckoutTenderBuyerView | null = null;
  let loadError: string | null = null;

  try {
    const row = await TenderBuyerService.getTenderBuyerByProcessUuid(
      processUUID,
    );
    tenderBuyer = {
      organizationId: row.organizationId,
      tender: {
        id: row.tender.id,
        description: row.tender.description,
        zipcode: row.tender.zipcode,
        createdAt: String(row.tender.createdAt),
        service: row.tender.service
          ? { name: row.tender.service.name, leadPrice: Number(row.tender.service.leadPrice) }
          : null,
        customer: row.tender.customer
          ? {
              name: row.tender.customer.name ?? null,
              email: row.tender.customer.email,
              phone: row.tender.customer.phone ?? null,
            }
          : null,
      },
      buyer: {
        name: row.buyer.name ?? null,
        email: row.buyer.email,
        phone: row.buyer.phone ?? null,
      },
    };
  } catch (error) {
    loadError = getErrorMessage(error);
  }

  return (
    <PanelPage>
      <CheckoutContent
        processUUID={processUUID}
        tenderBuyer={tenderBuyer}
        error={loadError}
      />
    </PanelPage>
  );
}
