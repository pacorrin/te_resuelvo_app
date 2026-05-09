"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  MapPin,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Progress } from "@/src/components/ui/progress";

export type FollowUpTimelineStep = {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: LucideIcon;
  completed: boolean;
};

const INITIAL_TIMELINE: FollowUpTimelineStep[] = [
  {
    id: 1,
    date: "15 Ene, 10:30 AM",
    title: "Lead adquirido",
    description: "Compraste este lead y recibiste los datos del cliente",
    icon: CheckCircle,
    completed: true,
  },
  {
    id: 2,
    date: "15 Ene, 11:00 AM",
    title: "Primer contacto",
    description: "Contactaste al cliente por WhatsApp",
    icon: MessageSquare,
    completed: true,
  },
  {
    id: 3,
    date: "15 Ene, 3:00 PM",
    title: "Visita programada",
    description: "Agendaste visita para mañana a las 2:00 PM",
    icon: Calendar,
    completed: true,
  },
  {
    id: 4,
    date: "Pendiente",
    title: "Realizar visita",
    description: "Visita al domicilio del cliente",
    icon: MapPin,
    completed: false,
  },
  {
    id: 5,
    date: "Pendiente",
    title: "Enviar cotización",
    description: "Proporciona presupuesto detallado",
    icon: FileText,
    completed: false,
  },
  {
    id: 6,
    date: "Pendiente",
    title: "Cierre del servicio",
    description: "Trabajo completado y pago recibido",
    icon: DollarSign,
    completed: false,
  },
];

export default function FollowUpTimelineCard() {
  const [timeline] = useState<FollowUpTimelineStep[]>(INITIAL_TIMELINE);

  const progressPercent = useMemo(() => {
    if (timeline.length === 0) return 0;
    const done = timeline.filter((t) => t.completed).length;
    return Math.round((done / timeline.length) * 100);
  }, [timeline]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Línea de Tiempo del Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    item.completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                {index < timeline.length - 1 && (
                  <div
                    className={`h-12 w-0.5 ${
                      item.completed ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium">{item.title}</p>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progreso del servicio</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
