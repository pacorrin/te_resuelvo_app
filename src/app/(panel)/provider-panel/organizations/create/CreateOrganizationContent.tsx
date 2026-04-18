"use client";
import { useState } from "react";
import { Upload, Building2, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import CoverageZonesSection from "./CoverageZones";
import Link from "next/link";
import { _createOrganization } from "@/src/lib/actions/organization.actions";
import type { CreateOrganizationCoverageAreaDTO } from "@/src/lib/dtos/OrganizationCoverageArea.dto";
import { useRouter } from "next/navigation";
import { OrganizationBusinessType } from "@/src/lib/enums/organizations.enum";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/src/components/ui/select";
import { CreateOrganizationDTO } from "@/src/lib/dtos/Organizations.dto";
import { OrganizationBusinessTypeLabels } from "@/src/lib/utils/enum_labels/organization.lables";

export function CreateOrganizationContent() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crear tu organización</h1>
        <p className="text-muted-foreground">
          Configura los datos de tu negocio, agrega miembros y define tus zonas
          de cobertura para poder empezar a ofrecer tus servicios
        </p>
      </div>

      <CreateOrganizationForm />
    </div>
  );
}

const initialOrgData = {
  name: "",
  businessType: "1",
  rfc: "",
  contactEmail: "",
  phone: "",
  fiscalAddress: "",
  description: "",
  image: "",
};

export function CreateOrganizationForm() {
  const [orgData, setOrgData] = useState<CreateOrganizationDTO>(initialOrgData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const updateOrgField = <K extends keyof typeof orgData>(
    field: K,
    value: (typeof orgData)[K],
  ) => setOrgData((prev) => ({ ...prev, [field]: value }));

  const [coverageZones, setCoverageZones] = useState<
    CreateOrganizationCoverageAreaDTO[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const response = await _createOrganization({
      ...orgData,
      coverageZones,
    });

    if (response.success) {
      toast.success("¡Organización creada exitosamente!", {
        position: "top-center",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/provider-panel");
    } else {
      toast.error(response.error, {
        position: "top-center",
      });
    }
    setIsLoading(false);
  };

  return (
    <form className="space-y-8">
      {/* Section 1: Organization Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            <CardTitle>Datos de la organización</CardTitle>
          </div>
          <CardDescription>Información básica de tu negocio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Image */}
          <div className="space-y-2">
            <Label htmlFor="orgImage">Logo de la organización</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border-2 border-dashed bg-muted flex items-center justify-center">
                {orgData.image ? (
                  <img
                    src={orgData.image}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="orgImage"
                  type="text"
                  placeholder="URL de la imagen"
                  value={orgData.image}
                  onChange={(e) => updateOrgField("image", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Opcional - Formato recomendado: PNG o JPG, máximo 2MB
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nombre de la organización *</Label>
              <Input
                id="orgName"
                type="text"
                placeholder="Ej: Plomería Profesional SA"
                value={orgData.name}
                onChange={(e) => updateOrgField("name", e.target.value)}
                required
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Tipo de Organización</Label>
              <Select
                defaultValue={orgData.businessType.toString()}
                onValueChange={(value) => updateOrgField("businessType", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={OrganizationBusinessType.COMPANY.toString()}
                  >
                    {OrganizationBusinessTypeLabels[OrganizationBusinessType.COMPANY]}
                  </SelectItem>
                  <SelectItem
                    value={OrganizationBusinessType.INDIVIDUAL.toString()}
                  >
                    {OrganizationBusinessTypeLabels[OrganizationBusinessType.INDIVIDUAL]}
                  </SelectItem>
                  <SelectItem
                    value={OrganizationBusinessType.COOPERATIVE.toString()}
                  >
                    {OrganizationBusinessTypeLabels[OrganizationBusinessType.COOPERATIVE]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC *</Label>
              <Input
                id="rfc"
                type="text"
                placeholder="XAXX010101000"
                value={orgData.rfc}
                onChange={(e) =>
                  updateOrgField("rfc", e.target.value.toUpperCase())
                }
                required
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+52 55 1234 5678"
                value={orgData.phone}
                onChange={(e) => updateOrgField("phone", e.target.value)}
                required
                maxLength={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de contacto *</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contacto@empresa.com"
              value={orgData.contactEmail}
              onChange={(e) => updateOrgField("contactEmail", e.target.value)}
              required
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fiscalAddress">Dirección fiscal *</Label>
            <Input
              id="fiscalAddress"
              type="text"
              placeholder="Calle, número, colonia, ciudad, estado, CP"
              value={orgData.fiscalAddress}
              onChange={(e) => updateOrgField("fiscalAddress", e.target.value)}
              required
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción del negocio</Label>
            <Textarea
              id="description"
              placeholder="Describe tu negocio, servicios que ofreces, años de experiencia, etc."
              value={orgData.description}
              onChange={(e) => updateOrgField("description", e.target.value)}
              maxLength={1000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Opcional - {orgData.description?.length ?? 0}/1000 caracteres
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section: Coverage Zones */}
      <CoverageZonesSection onCoverageZonesChange={setCoverageZones} />

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Link href="/provider-panel">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </Link>
        <Button size="lg" className="min-w-[200px]" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear organización"}
        </Button>
      </div>
    </form>
  );
}
