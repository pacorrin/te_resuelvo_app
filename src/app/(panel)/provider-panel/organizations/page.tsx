import { CheckCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { PanelHeader } from "../../../../components/PanelHeader";
import { TeamMembersSection } from "./TeamMembersSection";
import { OrganizationDataCard } from "./OrganizationDataCard";
import { ServicesSection } from "./ServicesSection";
import { CoverageAreasSection } from "./CoverageAreasSection";
import { OrganizationLogoCard } from "./OrganizationLogoCard";
import { _getOrganization } from "@/src/lib/actions/organization.actions";
import { _getOrganizationMembers } from "@/src/lib/actions/organization_members.actions";
import { _getOrganizationServices } from "@/src/lib/actions/organizations-services.actions";
import { _getOrganizationCoverageAreas } from "@/src/lib/actions/organization-coverage.actions";

export default async function OrganizationPage() {

  const { data: organization } = await _getOrganization();
  const { members } = await _getOrganizationMembers(organization?.id!);
  const { services: organizationServices } = await _getOrganizationServices(organization?.id!);
  const coverageAreasResult = await _getOrganizationCoverageAreas(
    organization?.id!,
  );
  const coverageAreas =
    coverageAreasResult.success && coverageAreasResult.data
      ? coverageAreasResult.data
      : [];

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-black"
    >
      <PanelHeader />

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* <OrganizationStats teamMembersCount={4} /> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <OrganizationDataCard organization={organization!} />
              <TeamMembersSection members={members!} organization={organization!} />
              <ServicesSection
                organizationId={organization!.id}
                initialOrganizationServices={organizationServices ?? []}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <OrganizationLogoCard organizationId={organization!.id} logo={organization!.image ?? null}/>

              {/* Team Stats */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Estadísticas del Equipo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Miembros activos</span>
                    <Badge variant="default" className="bg-green-600">
                      {teamMembers.filter((m) => m.status === "active").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Invitaciones pendientes</span>
                    <Badge variant="secondary">
                      {teamMembers.filter((m) => m.status === "pending").length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Administradores</span>
                    <Badge variant="outline">
                      {
                        teamMembers.filter(
                          (m) => m.role === "admin" || m.role === "owner",
                        ).length
                      }
                    </Badge>
                  </div>
                </CardContent>
              </Card> */}

              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Estado de Verificación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentos legales</span>
                    <Badge variant="secondary">
                      Pendiente
                    </Badge>
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm">Teléfono</span>
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  </div> */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dirección fiscal</span>
                    <Badge variant="secondary">Pendiente</Badge>
                  </div>
                </CardContent>
              </Card>

              <CoverageAreasSection
                organizationId={organization!.id}
                initialCoverageAreas={coverageAreas ?? []}
              />

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Configuración de facturación
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Configuración de notificaciones
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    Permisos y accesos
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    Cerrar organización
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
