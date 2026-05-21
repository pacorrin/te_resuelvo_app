import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { CustomerAccessForm } from "./CustomerAccessForm";

export default function SeguimientoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Seguimiento de solicitud</CardTitle>
              <CardDescription>
                Primero ingresa tu correo para recibir un código de acceso. Luego
                introdúcelo para ver el avance de tu solicitud.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerAccessForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
