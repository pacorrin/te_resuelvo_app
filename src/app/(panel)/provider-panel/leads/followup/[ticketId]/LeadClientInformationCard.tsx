"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";

export type LeadClientData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  preferredContact: string;
};

export default function LeadClientInformationCard({
  client,
}: {
  client: LeadClientData;
}) {
  // Keep a local copy so the card can evolve independently (e.g. inline edits later).
  const [localClient, setLocalClient] = useState(client);

  useEffect(() => {
    setLocalClient(client);
  }, [client]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
        <CardDescription>
          Datos de contacto y preferencias del cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Nombre completo
              </Label>
              <p className="font-medium">{localClient.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Teléfono</Label>
              <p className="font-medium">{localClient.phone}</p>
              <a
                href={`tel:${localClient.phone}`}
                className="text-xs text-primary hover:underline"
              >
                Llamar ahora
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="font-medium text-sm">{localClient.email}</p>
              <a
                href={`mailto:${localClient.email}`}
                className="text-xs text-primary hover:underline"
              >
                Enviar correo
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                Contacto preferido
              </Label>
              <p className="font-medium">{localClient.preferredContact}</p>
              <a
                href={`https://wa.me/${localClient.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">
              Dirección del servicio
            </Label>
            <p className="font-medium">{localClient.address}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(localClient.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

