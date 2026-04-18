"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Info,
  Pencil,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils"; // for dynamic classes if needed
import {
  OrganizationDTO,
  UpdateOrganizationDTO,
} from "@/src/lib/dtos/Organizations.dto";
import { OrganizationBusinessType } from "@/src/lib/enums/organizations.enum";
import { _updateOrganization } from "@/src/lib/actions/organization.actions";
import { toast } from "sonner";
import { OrganizationBusinessTypeLabels } from "@/src/lib/utils/enum_labels/organization.lables";

const DEFAULT_COUNTRY = "México";

type FiscalAddressParts = {
  calle: string;
  colonia: string;
  estado: string;
  codigoPostal: string;
  numeroInterior: string;
  numeroExterior: string;
  pais: string;
};

function formatFiscalAddress(parts: FiscalAddressParts): string {
  const pais = parts.pais.trim() || DEFAULT_COUNTRY;
  const segments: string[] = [];
  if (parts.calle.trim()) segments.push(parts.calle.trim());
  if (parts.colonia.trim()) segments.push(`Col. ${parts.colonia.trim()}`);
  if (parts.estado.trim()) segments.push(parts.estado.trim());
  if (parts.codigoPostal.trim())
    segments.push(`C.P. ${parts.codigoPostal.trim()}`);
  if (parts.numeroInterior.trim())
    segments.push(`Int. ${parts.numeroInterior.trim()}`);
  if (parts.numeroExterior.trim())
    segments.push(`Ext. ${parts.numeroExterior.trim()}`);
  if (pais) segments.push(pais);
  return segments.join(", ");
}

/** Best-effort parse for strings saved with {@link formatFiscalAddress}; legacy free-text stays in calle. */
function parseFiscalAddress(raw: string): FiscalAddressParts {
  const empty: FiscalAddressParts = {
    calle: "",
    colonia: "",
    estado: "",
    codigoPostal: "",
    numeroInterior: "",
    numeroExterior: "",
    pais: DEFAULT_COUNTRY,
  };
  if (!raw?.trim()) return empty;

  const colonia = raw.match(/Col\.\s*([^,]+)/i)?.[1]?.trim() ?? "";
  const codigoPostal = raw.match(/C\.P\.\s*([^,]+)/i)?.[1]?.trim() ?? "";
  const numeroInterior = raw.match(/Int\.\s*([^,]+)/i)?.[1]?.trim() ?? "";
  const numeroExterior = raw.match(/Ext\.\s*([^,]+)/i)?.[1]?.trim() ?? "";

  if (!colonia && !codigoPostal && !numeroInterior && !numeroExterior) {
    return { ...empty, calle: raw.trim(), pais: DEFAULT_COUNTRY };
  }

  let remainder = raw
    .replace(/Col\.\s*[^,]+/gi, "")
    .replace(/C\.P\.\s*[^,]+/gi, "")
    .replace(/Int\.\s*[^,]+/gi, "")
    .replace(/Ext\.\s*[^,]+/gi, "")
    .replace(/,\s*,/g, ",")
    .replace(/^,\s*|,\s*$/g, "")
    .trim();

  const segments = remainder
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  let pais = DEFAULT_COUNTRY;
  let estado = "";
  let calle = remainder;

  if (segments.length > 0) {
    const last = segments[segments.length - 1];
    if (/^(méxico|mexico)$/i.test(last)) {
      pais = last;
      segments.pop();
    }
  }
  if (segments.length >= 2) {
    estado = segments[segments.length - 1] ?? "";
    calle = segments.slice(0, -1).join(", ");
  } else if (segments.length === 1) {
    calle = segments[0] ?? "";
  }

  return {
    calle,
    colonia,
    estado,
    codigoPostal,
    numeroInterior,
    numeroExterior,
    pais,
  };
}

type Mode = "view" | "edit";

interface OrganizationDataCardProps {
  organization: OrganizationDTO;
}

function OrganizationDataViewMode({ organization }: OrganizationDataCardProps) {
  function InfoRow({
    icon: Icon,
    label,
    value,
    className,
  }: {
    icon?: React.ElementType;
    label: string;
    value: string;
    className?: string;
  }) {
    return (
      <div className={cn("space-y-0.5", className)}>
        <Label className="text-muted-foreground">{label}</Label>
        <div className="flex items-center text-base">
          {Icon ? (
            <Icon className="mr-2 w-4 min-w-4 h-4 text-secondary" />
          ) : null}
          <span>
            {value || <span className="text-muted-foreground">—</span>}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <InfoRow icon={Building2} label="Nombre" value={organization.name} />
      <div className="grid grid-cols-3 gap-16">
        <InfoRow
          label="Tipo de Organización"
          value={OrganizationBusinessTypeLabels[organization.businessType]}
        />
        <InfoRow label="RFC" value={organization.rfc} />
      </div>
      <div className="grid grid-cols-3 gap-16">
        <InfoRow
          icon={Mail}
          label="Email de contacto"
          value={organization.contactEmail}
        />
        <InfoRow
          icon={Phone}
          label="Teléfono principal"
          value={organization.phone}
        />
      </div>
      <InfoRow
        icon={MapPin}
        label="Dirección fiscal"
        value={organization.fiscalAddress}
      />
      <div>
        <Label className="text-muted-foreground">Descripción del negocio</Label>
        <div className="text-base whitespace-pre-line">
          {organization.description}
        </div>
        <div className="flex items-start gap-2 mt-2 rounded-lg border border-info-border bg-info-background px-3 py-2 text-sm text-info-foreground">
          <Info className="h-4 w-4 shrink-0 text-info mt-0.5 " />
          <span className="text-info-foreground">
            Esta descripción se mostrará a los clientes potenciales
          </span>
        </div>
      </div>
    </div>
  );
}

function OrganizationDataEditMode({
  organization,
  handleSave,
  handleCancel,
}: {
  organization: OrganizationDTO;
  handleSave: (data: OrganizationDTO) => void;
  handleCancel: () => void;
}) {
  const [updateOrganizationData, setUpdateOrganizationData] =
    useState<UpdateOrganizationDTO>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fiscalParts, setFiscalParts] = useState<FiscalAddressParts>(() =>
    parseFiscalAddress(organization.fiscalAddress),
  );

  const updateOrganizationField = <K extends keyof UpdateOrganizationDTO>(
    field: K,
    value: (typeof updateOrganizationData)[K],
  ) => setUpdateOrganizationData((prev) => ({ ...prev, [field]: value }));

  const setFiscalPart = <K extends keyof FiscalAddressParts>(
    key: K,
    value: FiscalAddressParts[K],
  ) => {
    setFiscalParts((prev) => {
      const next = { ...prev, [key]: value };
      updateOrganizationField("fiscalAddress", formatFiscalAddress(next));
      return next;
    });
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    const response = await _updateOrganization(
      organization.id,
      updateOrganizationData,
    );
    console.log(updateOrganizationData);
    if (response.success) {
      handleSave({
        ...organization,
        ...updateOrganizationData,
      });
    } else {
      toast.error(response.error!, {
        position: "top-center",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <Input
            id="name"
            onChange={(e) => updateOrganizationField("name", e.target.value)}
            defaultValue={organization.name}
            className="pl-10"
            autoComplete="organization"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessType">Tipo de Organización</Label>
          <Select
            defaultValue={organization.businessType.toString()}
            onValueChange={(value) =>
              updateOrganizationField(
                "businessType",
                Number(value) as OrganizationBusinessType,
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrganizationBusinessType.COMPANY.toString()}>
                Empresa
              </SelectItem>
              <SelectItem
                value={OrganizationBusinessType.INDIVIDUAL.toString()}
              >
                Trabajador Autónomo
              </SelectItem>
              <SelectItem
                value={OrganizationBusinessType.COOPERATIVE.toString()}
              >
                Cooperativa
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rfc">RFC</Label>
          <Input
            id="rfc"
            defaultValue={organization.rfc}
            autoComplete="off"
            onChange={(e) => updateOrganizationField("rfc", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Email de contacto</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <Input
            id="contactEmail"
            type="email"
            defaultValue={organization.contactEmail}
            className="pl-10"
            autoComplete="email"
            onChange={(e) =>
              updateOrganizationField("contactEmail", e.target.value)
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono principal</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <Input
            id="phone"
            defaultValue={organization.phone}
            className="pl-10"
            autoComplete="tel"
            onChange={(e) => updateOrganizationField("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 shrink-0 text-secondary" />
          <Label className="text-base font-medium">Dirección fiscal</Label>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="fiscal-calle">Calle</Label>
            <Input
              id="fiscal-calle"
              value={fiscalParts.calle}
              onChange={(e) => setFiscalPart("calle", e.target.value)}
              autoComplete="street-address"
              placeholder="Calle o avenida"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscal-colonia">Colonia</Label>
              <Input
                id="fiscal-colonia"
                value={fiscalParts.colonia}
                onChange={(e) => setFiscalPart("colonia", e.target.value)}
                autoComplete="address-level3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscal-estado">Estado</Label>
              <Input
                id="fiscal-estado"
                value={fiscalParts.estado}
                onChange={(e) => setFiscalPart("estado", e.target.value)}
                autoComplete="address-level1"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscal-cp">Código postal</Label>
              <Input
                id="fiscal-cp"
                value={fiscalParts.codigoPostal}
                onChange={(e) => setFiscalPart("codigoPostal", e.target.value)}
                autoComplete="postal-code"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscal-int">No. interior</Label>
              <Input
                id="fiscal-int"
                value={fiscalParts.numeroInterior}
                onChange={(e) =>
                  setFiscalPart("numeroInterior", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscal-ext">No. exterior</Label>
              <Input
                id="fiscal-ext"
                value={fiscalParts.numeroExterior}
                onChange={(e) =>
                  setFiscalPart("numeroExterior", e.target.value)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiscal-pais">País</Label>
            <Input
              id="fiscal-pais"
              value={fiscalParts.pais}
              onChange={(e) => setFiscalPart("pais", e.target.value)}
              autoComplete="country-name"
              placeholder={DEFAULT_COUNTRY}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-base font-medium">Descripción del negocio</Label>
        <Textarea
          id="description"
          defaultValue={organization.description || ""}
          className="min-h-[120px]"
          placeholder="Describe tu organización, experiencia, especialidades y qué la hace diferente..."
          onChange={(e) =>
            updateOrganizationField("description", e.target.value)
          }
          maxLength={1000}
          showCharCount={true}
        />
        <div className="flex items-start gap-2 mt-2 rounded-lg border border-info-border bg-info-background px-3 py-2 text-sm text-info-foreground">
          <Info className="h-4 w-4 shrink-0 text-info mt-0.5 " />
          <span className="text-info-foreground">
            Esta descripción se mostrará a los clientes potenciales
          </span>
        </div>
        <div className="flex gap-2 mt-2 w-full justify-end">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function OrganizationDataCard({
  organization,
}: OrganizationDataCardProps) {
  const [data, setData] = useState(organization);
  const [mode, setMode] = useState<Mode>("view");

  const handleEdit = () => {
    setMode("edit");
  };

  const handleCancel = () => {
    setMode("view");
  };

  const handleSave = (data: OrganizationDTO) => {
    console.log(data);
    setData(data);
    setMode("view");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Información de la Organización</CardTitle>
        </div>
        {mode === "view" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="self-start"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {mode === "view" ? (
          <OrganizationDataViewMode organization={data} />
        ) : (
          <OrganizationDataEditMode
            organization={data}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        )}
      </CardContent>
    </Card>
  );
}
