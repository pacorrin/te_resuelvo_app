"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";

export type FollowUpServiceDetails = {
  service: string;
  description: string;
  requestDate: string;
  scheduledDate: string;
  answers: { questionText: string; answer: string }[];
};

const DESCRIPTION_PREVIEW_CHARS = 220;

export default function FollowUpServiceDetailsCard({
  service,
  description,
  requestDate,
  scheduledDate,
  answers,
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

        <Separator />

        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-2 mt-0.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
              <ClipboardList className="h-5 w-5 text-secondary-400" aria-hidden />
            </div>
            <Label className="text-sm font-medium">Detalles adicionales</Label>
          </div>
     
          
          <div className="min-w-0 flex-1 space-y-3">

            {answers.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay respuestas registradas.
              </p>
            ) : (
              <ul className="space-y-2">
                {answers.map((item, index) => (
                  <li
                    key={`${item.questionText}-${index}`}
                    className="border-border/80 bg-muted/30 rounded-lg border px-3 py-2.5 shadow-sm"
                  >
                    <p className="text-foreground text-sm font-medium leading-snug">
                      {item.questionText}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                      {item.answer || "—"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
