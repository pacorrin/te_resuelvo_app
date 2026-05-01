"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

export type FollowUpServiceDetails = {
  service: string;
  description: string;
  requestDate: string;
  scheduledDate: string;
};

const DESCRIPTION_PREVIEW_CHARS = 220;

export default function FollowUpServiceDetailsCard({
  service,
  description,
  requestDate,
  scheduledDate,
}: FollowUpServiceDetails) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const canTruncate = description.length > DESCRIPTION_PREVIEW_CHARS;
  const descriptionDisplay =
    canTruncate && !descriptionExpanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW_CHARS).trim()}…`
      : description;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Servicio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Servicio solicitado</Label>
          <p className="text-muted-foreground mt-1">{service}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Descripción del problema</Label>
          <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
            {descriptionDisplay}
          </p>
          {canTruncate ? (
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={() => setDescriptionExpanded((v) => !v)}
            >
              {descriptionExpanded ? "Ver menos" : "Ver más"}
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Fecha de solicitud</Label>
            <p className="text-muted-foreground text-sm mt-1">{requestDate}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Cita programada</Label>
            <p className="text-muted-foreground text-sm mt-1">{scheduledDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
