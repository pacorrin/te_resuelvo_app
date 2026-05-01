"use client";

import { useMemo } from "react";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { LeadClientData } from "./LeadClientInformationCard";
import { buildGoogleMapsSearchUrl } from "./leadClientMaps";

export type FollowUpQuickActionsClient = Pick<
  LeadClientData,
  "phone" | "email" | "address" | "latitude" | "longitude"
>;

export default function FollowUpQuickActionsCard({
  client,
}: {
  client: FollowUpQuickActionsClient;
}) {
  const links = useMemo(
    () => ({
      whatsapp: `https://wa.me/${client.phone.replace(/[^0-9]/g, "")}`,
      tel: `tel:${client.phone}`,
      mailto: `mailto:${client.email}`,
      maps: buildGoogleMapsSearchUrl(client),
    }),
    [
      client.phone,
      client.email,
      client.address,
      client.latitude,
      client.longitude,
    ],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.open(links.whatsapp, "_blank")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.open(links.tel, "_blank")}
        >
          <Phone className="mr-2 h-4 w-4" />
          Llamar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.open(links.mailto, "_blank")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.open(links.maps, "_blank")}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Direcciones
        </Button>
      </CardContent>
    </Card>
  );
}
