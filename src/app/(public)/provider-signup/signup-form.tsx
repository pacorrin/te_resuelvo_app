"use client";

import { User as UserIcon, AlertCircle } from "lucide-react";
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
import { Checkbox } from "@/src/components/ui/checkbox";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { _registerUser } from "@/src/lib/actions/user.actions";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Datos personales
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Términos
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar campos requeridos
    if (!formData.firstName.trim())
      newErrors.firstName = "El nombre es requerido";
    if (!formData.lastName.trim())
      newErrors.lastName = "El apellido es requerido";
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email inválido";

    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
    else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone))
      newErrors.phone = "Teléfono inválido";

    if (!formData.password.trim())
      newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 8)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirma tu contraseña";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    if (!formData.acceptedTerms)
      newErrors.acceptedTerms = "Debes aceptar los términos y condiciones";
    if (!formData.acceptedPrivacy)
      newErrors.acceptedPrivacy = "Debes aceptar el aviso de privacidad";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = await _registerUser({
      email: formData.email,
      name: formData.firstName + " " + formData.lastName,
      password: formData.password,
    });

    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error, {
        position: "top-center",
        richColors: true,
      });
      return;
    }

    router.push(
      `/provider-signup/email-verification?h=${result.data?.signupHash}&email=${formData.email}`,
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              <CardTitle>Datos Personales</CardTitle>
            </div>
            <CardDescription>
              Información básica del responsable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nombre(s) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Apellido(s) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Pérez García"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+52 55 1234-5678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Términos y Condiciones */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.acceptedTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("acceptedTerms", checked as boolean)
                }
              />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                Acepto los{" "}
                <span className="text-primary hover:underline">
                  términos y condiciones
                </span>{" "}
                de uso de la plataforma <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.acceptedTerms && (
              <p className="text-xs text-red-500 ml-6">
                {errors.acceptedTerms}
              </p>
            )}

            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={formData.acceptedPrivacy}
                onCheckedChange={(checked) =>
                  handleInputChange("acceptedPrivacy", checked as boolean)
                }
              />
              <label htmlFor="privacy" className="text-sm cursor-pointer">
                Acepto el{" "}
                <span className="text-primary hover:underline">
                  aviso de privacidad
                </span>{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.acceptedPrivacy && (
              <p className="text-xs text-red-500 ml-6">
                {errors.acceptedPrivacy}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Todos los campos marcados con{" "}
            <span className="text-red-500">*</span> son obligatorios. Asegúrate
            de completar toda la información correctamente.
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Continuar a Verificación"}
          </Button>
        </div>
      </div>
    </form>
  );
}
