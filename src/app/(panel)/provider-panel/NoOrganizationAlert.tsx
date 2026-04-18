"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { AlertCircle, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NoOrganizationAlert() {
  return (
    <div className="w-full mx-auto my-8">
      <Alert
        variant="default"
        className="flex flex-col sm:flex-row border-cyan-200 bg-cyan-50 dark:bg-cyan-950/30 dark:border-cyan-900/50 shadow-sm"
      >
        <div className="flex flex-col w-full items-center sm:items-start justify-between gap-4 p-2">
          <div className="flex w-full items-start gap-4 text-center">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
              <AlertCircle className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="flex justify-between w-full items-center">
              <AlertTitle className="text-xl font-bold text-cyan-900 dark:text-cyan-100">
                Aún no tienes una organización
              </AlertTitle>
              <Link href="/provider-panel/organizations/create" passHref>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg rounded-xl flex gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  Crear Mi Organización
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full">
            <AlertDescription className="w-full mt-2 text-cyan-800 dark:text-cyan-200 opacity-90">
              Para empezar a ofrecer tus servicios y recibir solicitudes en la
              plataforma, primero debes registrar y configurar los datos de tu
              organización.
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}
