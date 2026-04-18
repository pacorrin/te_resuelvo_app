
import { CreateOrganizationContent } from "./CreateOrganizationContent";
import { PanelHeader } from "@/src/components/PanelHeader";

export default function CreateOrganizationPage() {
  return (
    <div className="min-h-screen bg-background">
      <PanelHeader />
      <CreateOrganizationContent />
    </div>
  );
}
