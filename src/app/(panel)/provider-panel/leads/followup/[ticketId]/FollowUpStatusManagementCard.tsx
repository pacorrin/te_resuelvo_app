"use client";

import { useFollowUpTicketStatus } from "./FollowUpTicketStatus";
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
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import { _updateTicketStatus } from "@/src/lib/actions/service-tickets.actions";
import { toastError } from "@/src/lib/utils";

type FollowUpStatusManagementCardProps = {
  ticketId: number;
};

export default function FollowUpStatusManagementCard({
  ticketId,
}: FollowUpStatusManagementCardProps) {
  const { status, setStatus } = useFollowUpTicketStatus();

  const handleStatusChange = async (value: string) => {
    const nextStatus = Number(value) as ServiceTicketStatus;
    const result = await _updateTicketStatus(ticketId, nextStatus);
    if (result.success) {
      setStatus(nextStatus);
    } else {
      toastError(result.error ?? "No se pudo actualizar el estado del ticket.");
    }
  };

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-base">Estado del servicio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select value={String(status)} onValueChange={handleStatusChange}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {status == ServiceTicketStatus.PENDING && (
                <SelectItem value={ServiceTicketStatus.PENDING.toString()}>
                  Pendiente
                </SelectItem>
              )}
              <SelectItem value={ServiceTicketStatus.CONTACTED.toString()}>
                Contactado
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.QUOTED.toString()}>
                Cotizado
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.IN_PROGRESS.toString()}>
                En progreso
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.COMPLETED.toString()}>
                Completado
              </SelectItem>
              <SelectItem value={ServiceTicketStatus.CANCELLED.toString()}>
                Cancelado
              </SelectItem>
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
            <DollarSign className="mr-2 h-4 w-4" />
            Registrar pago
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
