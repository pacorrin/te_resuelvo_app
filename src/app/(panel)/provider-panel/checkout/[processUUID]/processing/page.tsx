import { PanelPage } from "@/src/components/PanelPage";
import ProcessingCheckoutClient from "./ProcessingCheckoutClient";
import { TenderBuyerService } from "@/src/lib/services/tender-buyer.service";
import { getErrorMessage } from "@/src/lib/utils/error";
import { redirect } from "next/navigation";
import { TenderPaymentStatus } from "@/src/lib/enums/tender.enum";

export default async function ProcessingCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ processUUID: string }>;
  searchParams: Promise<{ session_id?: string; tender_id?: string }>;
}) {
  const { processUUID } = await params;
  const sp = await searchParams;
  let row ;

  try {
    row = await TenderBuyerService.getTenderBuyerByProcessUuid(processUUID);
  } catch (error) {
    return redirect("/provider-panel");
  }

  if (row) {
    if (row.paymentStatus === TenderPaymentStatus.PAID) {
      redirect("/provider-panel");
    }
  }

  return (
    <PanelPage>
      <ProcessingCheckoutClient
        processUUID={processUUID}
        sessionId={sp.session_id}
        initialTenderId={sp.tender_id}
      />
    </PanelPage>
  );
}
