"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ClipboardList } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { _createTenderFromPublicSiteAction } from "@/src/lib/actions/tender.actions";
import { _getServiceQuestionSet } from "@/src/lib/actions/services.actions";
import { QuestionSetClientDTO } from "@/src/lib/dtos/QuestionSets.dto";
import {
  CreateTenderFromPublicSiteDTO,
  type CreateTenderFromPublicSiteQuestionAnswerDTO,
} from "@/src/lib/dtos/Tenders.dto";
import { toast } from "sonner";
import { Spinner } from "@/src/components/ui/spinner";
import { getTenderNumber } from "@/src/lib/utils/tender.utils";
import { cn } from "@/src/lib/utils";

const inputSurface =
  "bg-muted/50 border-muted-foreground/10 shadow-none focus-visible:bg-background";

export const CUSTOMER_REQUEST_FORM_STEPS = [
  { label: "Tus datos", description: "Contacto, servicio, ubicación y descripción" },
  { label: "Detalles", description: "Preguntas adicionales" },
] as const;

export type CustomerRequestFormProps = {
  addressLine: string;
  setAddressLine: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  mapPickerMounted: boolean;
  onOpenMapPicker: () => void;
  selectedLocation: { lat: number; lng: number } | null;
  activeStep: number;
  onActiveStepChange: (step: number) => void;
};

export function CustomerRequestForm({
  addressLine,
  setAddressLine: _setAddressLine,
  postalCode,
  setPostalCode,
  mapPickerMounted,
  onOpenMapPicker,
  selectedLocation,
  activeStep,
  onActiveStepChange,
}: CustomerRequestFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingQuestionSet, setIsFetchingQuestionSet] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceQuestionSet, setServiceQuestionSet] = useState<QuestionSetClientDTO | null>(null);
  const [detailAnswers, setDetailAnswers] = useState<Record<string, string>>({});
  const activeQuestions = serviceQuestionSet?.questions ?? [];

  const setDetailAnswer = (id: string, value: string) => {
    setDetailAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const validateStep0 = (): boolean => {
    const form = document.getElementById("customer-request-form") as HTMLFormElement | null;
    const name = form?.querySelector<HTMLInputElement>('[name="name"]');
    const phone = form?.querySelector<HTMLInputElement>('[name="phone"]');
    const email = form?.querySelector<HTMLInputElement>('[name="email"]');
    const description = form?.querySelector<HTMLTextAreaElement>('[name="description"]');

    if (!name?.value.trim()) {
      toast.error("Indica tu nombre completo.");
      name?.focus();
      return false;
    }
    if (!phone?.value.trim()) {
      toast.error("Indica un teléfono de contacto.");
      phone?.focus();
      return false;
    }
    if (!email?.value.trim()) {
      toast.error("Indica tu correo electrónico.");
      email?.focus();
      return false;
    }
    if (!selectedService) {
      toast.error("Selecciona un tipo de servicio.");
      return false;
    }
    if (!addressLine.trim()) {
      toast.error("Indica una dirección.");
      return false;
    }
    if (!postalCode.trim()) {
      toast.error("Indica el código postal.");
      return false;
    }
    if (!description?.value.trim()) {
      toast.error("Describe el problema o el servicio que necesitas.");
      description?.focus();
      return false;
    }
    return true;
  };

  const goNext = async () => {
    if (!validateStep0()) return;
    setIsFetchingQuestionSet(true);
    const result = await _getServiceQuestionSet(null, Number(selectedService));
    setIsFetchingQuestionSet(false);

    if (!result.success) {
      toast.error(result.error || "No se pudo obtener el cuestionario del servicio.");
      return;
    }

    setServiceQuestionSet(result.data ?? null);
    setDetailAnswers({});
    onActiveStepChange(1);
  };

  const buildDescriptionWithAnswers = (baseDescription: string): string => {
    const lines = activeQuestions.map((q) => {
      const key = String(q.id);
      const value = detailAnswers[key];
      if (!value) return null;
      const opt = q.options?.find((o) => o === value);
      return `${q.questionText}: ${opt ?? value}`;
    }).filter(Boolean) as string[];

    if (lines.length === 0) return baseDescription.trim();
    const block = lines.join("\n");
    const trimmed = baseDescription.trim();
    return trimmed ? `${trimmed}\n\n— Detalles —\n${block}` : `— Detalles —\n${block}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const q of activeQuestions) {
      if (q.required && !detailAnswers[String(q.id)]) {
        toast.error(`Responde: ${q.questionText}`);
        return;
      }
    }

    if (!addressLine.trim()) {
      toast.error("Indica una dirección.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    if (selectedLocation) {
      console.log("Selected location:", selectedLocation);
    }

    const rawDescription = (formData.get("description") as string) || "";
    const questionSetAnswers =
      serviceQuestionSet && activeQuestions.length > 0
        ? activeQuestions
            .map((q) => {
              const answer = detailAnswers[String(q.id)]?.trim();
              if (!answer) return null;
              return {
                questionSetId: serviceQuestionSet.id,
                questionId: q.id,
                answer,
              };
            })
            .filter(
              (row): row is CreateTenderFromPublicSiteQuestionAnswerDTO => row !== null,
            )
        : undefined;

    const data: CreateTenderFromPublicSiteDTO = {
      personName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      serviceId: Number(selectedService),
      tenderAddress: addressLine.trim(),
      zipcode: postalCode.trim(),
      tenderAddressReference: formData.get("address-reference") as string,
      description: buildDescriptionWithAnswers(rawDescription),
      latitude: selectedLocation?.lat.toString() || "",
      longitude: selectedLocation?.lng.toString() || "",
      questionSetAnswers,
    };

    const result = await _createTenderFromPublicSiteAction(data);
    if (result.success && result.data) {
      const requestNumber = getTenderNumber(result.data.id);
      const params = new URLSearchParams({
        email: data.email,
        requestNumber,
      });
      setIsLoading(false);
      router.push(`/solicitud-exitosa?${params.toString()}`);
    } else {
      setIsLoading(false);
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <ClipboardList className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Solicita un profesional
        </h2>
      </div>

      <form
        id="customer-request-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {mapPickerMounted ? (
          <input type="hidden" name="address" value={addressLine} />
        ) : null}

        <fieldset
          className={cn("contents border-0 p-0", activeStep !== 0 && "hidden")}
        >
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="hero-name" className="text-xs font-semibold">
              Nombre completo
            </Label>
            <Input
              id="hero-name"
              name="name"
              placeholder="Juan Pérez"
              required
              onFocus={onOpenMapPicker}
              className={cn("h-11", inputSurface)}
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="hero-phone" className="text-xs font-semibold">
              Teléfono
            </Label>
            <Input
              id="hero-phone"
              name="phone"
              type="tel"
              placeholder="+52 55 1234 5678"
              required
              onFocus={onOpenMapPicker}
              className={cn("h-11", inputSurface)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-email" className="text-xs font-semibold">
              Correo electrónico
            </Label>
            <Input
              id="hero-email"
              name="email"
              type="email"
              placeholder="ejemplo@dominio.com"
              required
              onFocus={onOpenMapPicker}
              className={cn("h-11", inputSurface)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-service" className="text-xs font-semibold">
              Tipo de servicio
            </Label>
            <Select
              required
              value={selectedService}
              onValueChange={setSelectedService}
              onOpenChange={(open) => {
                if (open) onOpenMapPicker();
              }}
            >
              <SelectTrigger
                id="hero-service"
                className={cn("h-11 w-full", inputSurface)}
                onFocus={onOpenMapPicker}
              >
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Aires Acondicionados</SelectItem>
                <SelectItem value="2">Plomería</SelectItem>
                <SelectItem value="3">Electricidad</SelectItem>
                <SelectItem value="4">Pintura</SelectItem>
                <SelectItem value="5">Limpieza</SelectItem>
                <SelectItem value="6">Carpintería</SelectItem>
                <SelectItem value="7">Jardinería</SelectItem>
                <SelectItem value="8">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 md:col-span-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="hero-address-reference" className="text-xs font-semibold">
                Dirección
              </Label>
              <Input
                id="hero-address-reference"
                name="address-reference"
                placeholder="Calle, colonia, ciudad"
                onFocus={onOpenMapPicker}
                className={cn("h-11", inputSurface)}
              />
            </div>
            <div className="flex min-w-[100px] flex-col space-y-2">
              <Label htmlFor="hero-postal-code" className="text-xs font-semibold">
                C.P.
              </Label>
              <Input
                id="hero-postal-code"
                name={mapPickerMounted ? undefined : "postal-code"}
                placeholder="C.P."
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                onFocus={onOpenMapPicker}
                maxLength={8}
                required
                className={cn("h-11 sm:w-32", inputSurface)}
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-description" className="text-xs font-semibold">
              Descripción del problema
            </Label>
            <Textarea
              id="hero-description"
              name="description"
              placeholder="Describe qué servicio necesitas..."
              onFocus={onOpenMapPicker}
              className={cn("min-h-[100px] resize-y", inputSurface)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="button"
              size="lg"
              className="h-12 w-full text-base font-semibold shadow-lg shadow-primary/25"
              onClick={goNext}
              disabled={isFetchingQuestionSet}
            >
              {!isFetchingQuestionSet ? "Continuar" : <Spinner />}
            </Button>
          </div>
        </fieldset>

        <fieldset
          className={cn("contents border-0 p-0", activeStep !== 1 && "hidden")}
        >
          <div className="space-y-4 md:col-span-2">
            <p className="text-sm font-medium text-foreground">
              Unas preguntas rápidas
            </p>
            <div className="grid grid-cols-1 gap-4">
              {activeQuestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Este servicio no tiene preguntas adicionales.
                </p>
              ) : null}
              {activeQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <Label htmlFor={`hero-q-${q.id}`} className="text-xs font-semibold">
                    {q.questionText}
                  </Label>
                  {q.options && q.options.length > 0 ? (
                    <Select
                      value={detailAnswers[String(q.id)] ?? ""}
                      onValueChange={(v) => setDetailAnswer(String(q.id), v)}
                    >
                      <SelectTrigger
                        id={`hero-q-${q.id}`}
                        className={cn("h-11 w-full", inputSurface)}
                      >
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={`hero-q-${q.id}`}
                      value={detailAnswers[String(q.id)] ?? ""}
                      onChange={(e) => setDetailAnswer(String(q.id), e.target.value)}
                      placeholder="Tu respuesta"
                      className={cn("h-11", inputSurface)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 md:col-span-2">
            <input
              id="hero-terms"
              name="terms"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              required
            />
            <Label
              htmlFor="hero-terms"
              className="text-sm font-normal leading-snug text-muted-foreground"
            >
              Acepto los términos y condiciones y la política de privacidad.
            </Label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:col-span-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-12 w-full shrink-0 gap-2 sm:w-auto"
              onClick={() => onActiveStepChange(0)}
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Atrás
            </Button>
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full flex-1 text-base font-semibold shadow-lg shadow-primary/25"
              disabled={isLoading}
            >
              {!isLoading ? "Enviar solicitud" : <Spinner />}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
