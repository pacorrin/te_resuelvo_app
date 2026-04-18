import NoOrganizationAlert from "./NoOrganizationAlert";
import { _checkUserHasOrganization } from "@/src/lib/actions/organization_members.actions";
import { auth } from "@/src/lib/auth/auth";
import Content from "./Content";
import { PanelPage } from "@/src/components/PanelPage";

export default async function ProviderDashboardPage() {
  const session = await auth();
  const user = session?.user;
  const hasOrganizationResponse = await _checkUserHasOrganization();

  return (
    <PanelPage>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Bienvenido {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Gestiona tus oportunidades de negocio
        </p>
      </div>

      {!hasOrganizationResponse.hasOrganization ? (
        <NoOrganizationAlert />
      ) : (
        <Content />
      )}
    </PanelPage>
  );
}
