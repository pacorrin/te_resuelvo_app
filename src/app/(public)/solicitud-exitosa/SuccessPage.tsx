"use client";

import { CheckCircle, Mail, Clock, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PublicFooter } from "@/src/components/PublicFooter";

export interface SuccessPageProps {
  onNavigate: (
    page:
      | "home"
      | "category"
      | "provider"
      | "dashboard"
      | "contact"
      | "how-it-works",
  ) => void;
  email?: string;
  requestNumber?: string;
}

export function SuccessPage({
  onNavigate,
  email = "tu correo electrónico",
  requestNumber = "SH-000000",
}: SuccessPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Success Content */}
      <main className="flex-1 px-4 md:px-6 py-8 md:py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6 animate-in zoom-in duration-300">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              ¡Solicitud enviada exitosamente!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Hemos recibido tu solicitud y estamos trabajando en conectarte con
              los mejores proveedores.
            </p>

            {/* Request Number Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-6 py-3">
              <span className="text-sm font-medium text-muted-foreground">
                Número de solicitud:
              </span>
              <span className="text-xl font-bold text-primary">
                {requestNumber}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              También te enviaremos este número a tu correo electrónico
            </p>
          </div>

          {/* Information Cards */}
          <div className="space-y-4 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Revisa tu correo electrónico
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Te hemos enviado un correo de confirmación a{" "}
                      <strong>{email}</strong> con los detalles de tu solicitud.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Próximos pasos</CardTitle>
                    <CardDescription className="mt-2">
                      En las próximas horas, proveedores verificados revisarán
                      tu solicitud y se pondrán en contacto contigo directamente
                      por WhatsApp y/o correo electrónico.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Te mantendremos informado
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Recibirás notificaciones por correo sobre el estado de tu
                      solicitud y cuando los proveedores muestren interés en tu
                      proyecto.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>¿Qué sigue ahora?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div className="w-0.5 h-full bg-border mt-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold mb-1">
                      Confirmación inmediata
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Revisa tu correo para ver los detalles de tu solicitud.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div className="w-0.5 h-full bg-border mt-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold mb-1">
                      Revisión de proveedores
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Los profesionales en tu área recibirán tu solicitud (1-4
                      horas).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div className="w-0.5 h-full bg-border mt-2" />
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold mb-1">Contacto directo</h3>
                    <p className="text-sm text-muted-foreground">
                      Los proveedores interesados te contactarán por WhatsApp o
                      correo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Tú decides</h3>
                    <p className="text-sm text-muted-foreground">
                      Compara opciones y elige al proveedor que mejor se adapte
                      a tus necesidades.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("home")}
              className="sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
            <Button
              size="lg"
              onClick={() => onNavigate("home")}
              className="sm:w-auto"
            >
              Hacer otra solicitud
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              ¿Tienes alguna pregunta o problema?
            </p>
            <Button
              variant="link"
              className="text-primary"
              onClick={() => onNavigate("contact")}
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
