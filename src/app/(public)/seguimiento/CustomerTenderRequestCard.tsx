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
import type { CustomerTenderRequestDTO } from "@/src/lib/dtos/CustomerTenderPortal.dto";

const DESCRIPTION_PREVIEW_CHARS = 220;

type CustomerTenderRequestCardProps = {
  request: CustomerTenderRequestDTO;
};

export function CustomerTenderRequestCard({ request }: CustomerTenderRequestCardProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const canTruncate = request.description.length > DESCRIPTION_PREVIEW_CHARS;
  const descriptionDisplay =
    canTruncate && !descriptionExpanded
      ? `${request.description.slice(0, DESCRIPTION_PREVIEW_CHARS).trim()}…`
      : request.description;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu solicitud</CardTitle>
        <p className="text-sm text-muted-foreground">
          Número de solicitud:{" "}
          <span className="font-semibold text-primary">{request.requestNumber}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Servicio solicitado</Label>
          <p className="mt-1 text-muted-foreground">{request.serviceName}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Descripción del problema</Label>
          <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-medium">Fecha de solicitud</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {request.requestDate}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Teléfono</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {request.personPhone}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Correo</Label>
            <p className="mt-1 text-sm text-muted-foreground">{request.email}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Código postal</Label>
            <p className="mt-1 text-sm text-muted-foreground">{request.zipcode}</p>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-sm font-medium">Dirección</Label>
            <p className="mt-1 text-sm text-muted-foreground">{request.address}</p>
          </div>
          {request.addressReference ? (
            <div className="sm:col-span-2">
              <Label className="text-sm font-medium">Referencia</Label>
              <p className="mt-1 text-sm text-muted-foreground">
                {request.addressReference}
              </p>
            </div>
          ) : null}
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/15">
              <ClipboardList
                className="h-5 w-5 text-secondary-400"
                aria-hidden
              />
            </div>
            <Label className="text-sm font-medium">Detalles adicionales</Label>
          </div>
          {request.questionAnswers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay respuestas registradas.
            </p>
          ) : (
            <ul className="space-y-2">
              {request.questionAnswers.map((item, index) => (
                <li
                  key={`${item.questionText}-${index}`}
                  className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2.5 shadow-sm"
                >
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {item.questionText}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {item.answer || "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
