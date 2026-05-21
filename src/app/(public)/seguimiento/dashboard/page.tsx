import { redirect } from "next/navigation";
import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import { getCustomerTenderSession } from "@/src/lib/auth/customer-tender-session";
import { CustomerTenderPortalService } from "@/src/lib/services/customer-tender-portal.service";
import { CustomerTenderDashboard } from "../CustomerTenderDashboard";

export default async function SeguimientoDashboardPage() {
  const session = await getCustomerTenderSession();
  if (!session) {
    redirect("/seguimiento");
  }

  let overview;
  try {
    overview = await CustomerTenderPortalService.getOverview(
      session.tenderId,
      session.customerId,
    );
  } catch {
    redirect("/seguimiento");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto max-w-4xl">
          <CustomerTenderDashboard overview={overview} />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
