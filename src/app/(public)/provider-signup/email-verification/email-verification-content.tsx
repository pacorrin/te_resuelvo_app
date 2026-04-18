import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { CodeValidationForm } from "./code-validation-form";

export interface EmailVerificationContentProps {
  email: string;
}

export default function EmailVerificationContent({
  email,
}: EmailVerificationContentProps) {
  return (
    <main className="min-h-screen flex-1 px-4 md:px-6 py-8 flex justify-center">
      <div className="w-full max-w-md">
        {/* Page Header */}
        <div className="mb-8 text-center text-balance">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verifica tu correo</h1>
          <p className="text-muted-foreground">
            Hemos enviado un código de verificación de 6 dígitos a
          </p>
          <p className="font-medium mt-1">{email}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Datos</span>
            </div>
            <div className="w-16 h-0.5 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium">Verificación</span>
            </div>
            <div className="w-16 h-0.5 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-sm text-muted-foreground">Completado</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Ingresa el código</CardTitle>
            <CardDescription>
              El código es válido por 10 minutos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CodeValidationForm />

            {/* Help Text */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Tip:</strong> Revisa tu bandeja de spam o correo no
                deseado si no encuentras el mensaje
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
