"use client";

import { useState } from "react";
import { Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type FollowUpStatusManagementCardProps = {
  initialStatus?: string;
  onStatusChange?: (status: string) => void;
};

export default function FollowUpStatusManagementCard({
  initialStatus = "in-progress",
  onStatusChange,
}: FollowUpStatusManagementCardProps) {
  const [status, setStatus] = useState(initialStatus);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange?.(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gestión de Estado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Estado actual</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contacted">Contactado</SelectItem>
              <SelectItem value="in-progress">En progreso</SelectItem>
              <SelectItem value="quoted">Cotizado</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Generar cotización
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Reagendar cita
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <DollarSign className="mr-2 h-4 w-4" />
            Registrar pago
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
