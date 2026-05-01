"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CheckSquare,
  Clock,
  FileText,
  Lightbulb,
  MessageSquare,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type RecommendationPriority = "high" | "medium" | "low";

export type FollowUpRecommendation = {
  icon: LucideIcon;
  title: string;
  description: string;
  priority: RecommendationPriority;
};

const INITIAL_RECOMMENDATIONS: FollowUpRecommendation[] = [
  {
    icon: MessageSquare,
    title: "Mantén comunicación constante",
    description:
      "Responde rápido a los mensajes del cliente. Una respuesta en menos de 2 horas aumenta la confianza en un 75%.",
    priority: "high",
  },
  {
    icon: Clock,
    title: "Sé puntual con los horarios",
    description:
      "Si acordaste una visita, llega a tiempo. Si hay algún imprevisto, avisa con anticipación.",
    priority: "high",
  },
  {
    icon: FileText,
    title: "Proporciona cotizaciones detalladas",
    description:
      "Detalla cada parte del trabajo y los costos. La transparencia genera confianza y reduce objeciones.",
    priority: "medium",
  },
  {
    icon: Star,
    title: "Pide testimonios al finalizar",
    description:
      "Si el cliente quedó satisfecho, pídele que deje una reseña. Esto aumentará tu reputación en la plataforma.",
    priority: "medium",
  },
  {
    icon: Bell,
    title: "Usa recordatorios automáticos",
    description:
      "Envía un mensaje de recordatorio al cliente 2 horas antes de la cita programada.",
    priority: "low",
  },
  {
    icon: CheckSquare,
    title: "Documenta el proceso",
    description:
      "Toma fotos del antes y después. Esto ayuda a justificar el trabajo realizado y genera confianza.",
    priority: "low",
  },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400";
    case "medium":
      return "text-yellow-600 dark:text-yellow-400";
    case "low":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-muted-foreground";
  }
}

export default function FollowUpRecommendationsCard() {
  const [recommendations] = useState<FollowUpRecommendation[]>(
    INITIAL_RECOMMENDATIONS,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <CardTitle className="text-base">Recomendaciones</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Tips para mejorar tu seguimiento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="rounded-lg border p-3">
            <div className="flex gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  rec.priority === "high"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : rec.priority === "medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30"
                }`}
              >
                <rec.icon
                  className={`h-4 w-4 ${getPriorityColor(rec.priority)}`}
                />
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-sm font-medium">{rec.title}</h4>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
