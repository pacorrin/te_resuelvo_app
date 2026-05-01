"use client";

import { useState } from "react";
import { Bell, MessageSquare, Send } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

const QUICK_MESSAGES = [
  "Hola, ya estoy en camino a tu domicilio. Llegaré en aproximadamente 20 minutos.",
  "He revisado el problema y necesito conseguir unas piezas. Te envío la cotización detallada.",
  "El trabajo ha sido completado exitosamente. Todo está funcionando correctamente.",
  "Gracias por tu confianza. Si necesitas algo más, no dudes en contactarme.",
];

export default function FollowUpCommunicationCenterCard() {
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleSendNotification = () => {
    if (notificationMessage.trim()) {
      setNotificationMessage("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Centro de Comunicación</CardTitle>
        <CardDescription className="text-xs">
          Envía notificaciones y actualiza al cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-sidebar" className="text-sm">
            Mensaje para el cliente
          </Label>
          <Textarea
            id="notification-sidebar"
            placeholder="Escribe un mensaje para notificar al cliente..."
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Mensajes rápidos</Label>
          <div className="grid grid-cols-1 gap-2">
            {QUICK_MESSAGES.map((msg, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto justify-start px-3 py-2 text-left"
                onClick={() => setNotificationMessage(msg)}
              >
                <MessageSquare className="mr-2 h-3 w-3 shrink-0" />
                <span className="line-clamp-2 text-xs">{msg}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={handleSendNotification}
            disabled={!notificationMessage.trim()}
          >
            <Send className="mr-2 h-3 w-3" />
            Enviar
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-3 w-3" />
            Recordar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
