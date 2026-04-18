"use client";

import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Send,
  Bell,
  Lightbulb,
  FileText,
  DollarSign,
  Star,
  CheckSquare,
  AlertTriangle,
  Info,
  XCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Progress } from "@/src/components/ui/progress";
import { PanelHeader } from "@/src/components/PanelHeader";
import LeadClientInformationCard from "./LeadClientInformationCard";

interface LeadFollowUpPageProps {
  onNavigate: (
    page:
      | "home"
      | "category"
      | "provider"
      | "dashboard"
      | "success"
      | "login"
      | "contact"
      | "how-it-works"
      | "provider-profile"
      | "lead-followup",
  ) => void;
  leadId?: string;
}

type Incident = {
  id: number;
  type: string;
  date: string;
  description: string;
  resolvedAt: string | null;
};

export default function LeadFollowUpPage({
  onNavigate,
  leadId = "L-1234",
}: LeadFollowUpPageProps) {
  const [status, setStatus] = useState("in-progress");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [showNotificationSuccess, setShowNotificationSuccess] = useState(false);

  // Incidencias state
  const [incidentType, setIncidentType] = useState("nota");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 1,
      type: "problema",
      date: "15 Ene, 2:00 PM",
      description:
        "Cliente reportó que la fuga es más grande de lo que pensaba. Requiere piezas adicionales.",
      resolvedAt: null,
    },
    {
      id: 2,
      type: "nota",
      date: "15 Ene, 4:30 PM",
      description:
        "Cliente mencionó que el problema comenzó hace 3 días. Pidió garantía por escrito.",
      resolvedAt: null,
    },
  ]);

  // Lead data
  const leadData = {
    id: leadId,
    service: "Reparación de fuga urgente",
    client: {
      name: "Ana María García",
      email: "ana.garcia@email.com",
      phone: "+52 55 9876-5432",
      address: "Calle Reforma 123, Col. Centro, Ciudad de México",
      preferredContact: "WhatsApp",
    },
    requestDate: "15 de Enero, 2026 - 10:30 AM",
    scheduledDate: "16 de Enero, 2026 - 2:00 PM",
    urgency: "Alta",
    description:
      "Tengo una fuga de agua en el baño principal que está causando daños. Necesito que alguien venga lo antes posible a revisarlo y repararlo.",
    budget: "$2,000 - $3,000 MXN",
    images: 2,
    status: "in-progress",
  };

  const [timeline, setTimeline] = useState([
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
  ]);

  const recommendations = [
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

  const quickMessages = [
    "Hola, ya estoy en camino a tu domicilio. Llegaré en aproximadamente 20 minutos.",
    "He revisado el problema y necesito conseguir unas piezas. Te envío la cotización detallada.",
    "El trabajo ha sido completado exitosamente. Todo está funcionando correctamente.",
    "Gracias por tu confianza. Si necesitas algo más, no dudes en contactarme.",
  ];

  const handleSendNotification = () => {
    if (notificationMessage.trim()) {
      setShowNotificationSuccess(true);
      setNotificationMessage("");
      setTimeout(() => setShowNotificationSuccess(false), 3000);
    }
  };

  const handleAddIncident = () => {
    if (incidentDescription.trim()) {
      const newIncident = {
        id: incidents.length + 1,
        type: incidentType,
        date: new Date().toLocaleDateString("es-MX", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        description: incidentDescription,
        resolvedAt: null,
      };
      setIncidents([newIncident, ...incidents]);
      setIncidentDescription("");
      setIncidentType("nota");
    }
  };

  const handleResolveIncident = (id: number) => {
    setIncidents(
      incidents.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              resolvedAt: new Date().toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : incident,
      ),
    );
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "problema":
        return AlertTriangle;
      case "retraso":
        return Clock;
      case "cancelacion":
        return XCircle;
      case "nota":
        return Info;
      default:
        return Info;
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case "problema":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "retraso":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "cancelacion":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "nota":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getIncidentLabel = (type: string) => {
    switch (type) {
      case "problema":
        return "Problema";
      case "retraso":
        return "Retraso";
      case "cancelacion":
        return "Cancelación";
      case "nota":
        return "Nota";
      default:
        return type;
    }
  };

  const getPriorityColor = (priority: string) => {
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
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "contacted":
        return "Contactado";
      case "in-progress":
        return "En progreso";
      case "quoted":
        return "Cotizado";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "contacted":
        return "bg-blue-600";
      case "in-progress":
        return "bg-yellow-600";
      case "quoted":
        return "bg-purple-600";
      case "completed":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      {/* <PanelHeader /> */}

      {/* Success Notification */}
      {showNotificationSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 px-4 py-3 mx-4 mt-4 rounded-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2 max-w-7xl mx-auto">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
            <p className="text-sm text-green-800 dark:text-green-200">
              Notificación enviada exitosamente al cliente
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Seguimiento de Lead {leadData.id}
                </h1>
                <p className="text-muted-foreground">
                  Gestiona y da seguimiento completo a este servicio
                </p>
              </div>
              <Badge
                variant="default"
                className={`${getStatusColor(status)} text-white px-6 py-2 text-lg font-semibold`}
              >
                {getStatusLabel(status)}
              </Badge>
            </div>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Solicitado
                      </p>
                      <p className="font-semibold">Hace 1 día</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Urgencia</p>
                      <p className="font-semibold">{leadData.urgency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Presupuesto
                      </p>
                      <p className="font-semibold text-sm">{leadData.budget}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progreso</p>
                      <p className="font-semibold">50%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Information */}
              <LeadClientInformationCard client={leadData.client} />

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Servicio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Servicio solicitado
                    </Label>
                    <p className="text-muted-foreground mt-1">
                      {leadData.service}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Descripción del problema
                    </Label>
                    <p className="text-muted-foreground mt-1">
                      {leadData.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Fecha de solicitud
                      </Label>
                      <p className="text-muted-foreground text-sm mt-1">
                        {leadData.requestDate}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Cita programada
                      </Label>
                      <p className="text-muted-foreground text-sm mt-1">
                        {leadData.scheduledDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
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
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.completed
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                          </div>
                          {index < timeline.length - 1 && (
                            <div
                              className={`w-0.5 h-12 ${
                                item.completed ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{item.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progreso del servicio</span>
                      <span className="font-medium">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Notas Internas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notas Internas</CardTitle>
                  <CardDescription className="text-xs">
                    Notas privadas (el cliente no las verá)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Agrega notas, observaciones o recordatorios..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <Button size="sm" className="w-full">
                    <FileText className="w-3 h-3 mr-2" />
                    Guardar notas
                  </Button>
                </CardContent>
              </Card>

              {/* Incidents Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <CardTitle>Incidencias del Servicio</CardTitle>
                  </div>
                  <CardDescription>
                    Documenta problemas, retrasos y notas importantes
                    relacionadas al servicio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Incident Form */}
                  <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1">
                        <Label htmlFor="incident-type" className="text-sm">
                          Tipo
                        </Label>
                        <Select
                          value={incidentType}
                          onValueChange={setIncidentType}
                        >
                          <SelectTrigger id="incident-type" className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nota">Nota</SelectItem>
                            <SelectItem value="problema">Problema</SelectItem>
                            <SelectItem value="retraso">Retraso</SelectItem>
                            <SelectItem value="cancelacion">
                              Cancelación
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label
                          htmlFor="incident-description"
                          className="text-sm"
                        >
                          Descripción
                        </Label>
                        <Input
                          id="incident-description"
                          placeholder="Describe la incidencia..."
                          value={incidentDescription}
                          onChange={(e) =>
                            setIncidentDescription(e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleAddIncident}
                      disabled={!incidentDescription.trim()}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar incidencia
                    </Button>
                  </div>

                  {/* Incidents List */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Historial de incidencias (
                      {incidents.filter((i) => !i.resolvedAt).length} activas)
                    </Label>
                    {incidents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No hay incidencias registradas
                      </div>
                    ) : (
                      incidents.map((incident) => {
                        const IncidentIcon = getIncidentIcon(incident.type);
                        return (
                          <div
                            key={incident.id}
                            className={`p-3 border rounded-lg ${
                              incident.resolvedAt
                                ? "opacity-60 bg-muted/20"
                                : ""
                            }`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center ${getIncidentColor(incident.type)}`}
                              >
                                <IncidentIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {getIncidentLabel(incident.type)}
                                    </Badge>
                                    {incident.resolvedAt && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                                      >
                                        Resuelta
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {incident.date}
                                  </span>
                                </div>
                                <p className="text-sm mb-2">
                                  {incident.description}
                                </p>
                                {incident.resolvedAt && (
                                  <p className="text-xs text-muted-foreground">
                                    Resuelta el {incident.resolvedAt}
                                  </p>
                                )}
                                {!incident.resolvedAt && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 h-7 text-xs"
                                    onClick={() =>
                                      handleResolveIncident(incident.id)
                                    }
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Marcar como resuelta
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Gestión de Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado actual</Label>
                    <Select value={status} onValueChange={setStatus}>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generar cotización
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Reagendar cita
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Registrar pago
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Centro de Comunicación */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Centro de Comunicación
                  </CardTitle>
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
                      {quickMessages.map((msg, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="justify-start text-left h-auto py-2 px-3"
                          onClick={() => setNotificationMessage(msg)}
                        >
                          <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="text-xs line-clamp-2">{msg}</span>
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
                      <Send className="w-3 h-3 mr-2" />
                      Enviar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="w-3 h-3 mr-2" />
                      Recordar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <CardTitle className="text-base">Recomendaciones</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Tips para mejorar tu seguimiento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex gap-3">
                        <div
                          className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center ${
                            rec.priority === "high"
                              ? "bg-red-100 dark:bg-red-900/30"
                              : rec.priority === "medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : "bg-blue-100 dark:bg-blue-900/30"
                          }`}
                        >
                          <rec.icon
                            className={`w-4 h-4 ${getPriorityColor(rec.priority)}`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {rec.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${leadData.client.phone.replace(/[^0-9]/g, "")}`,
                        "_blank",
                      )
                    }
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(`tel:${leadData.client.phone}`, "_blank")
                    }
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(`mailto:${leadData.client.email}`, "_blank")
                    }
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${encodeURIComponent(leadData.client.address)}`,
                        "_blank",
                      )
                    }
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Direcciones
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t px-4 md:px-6 py-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          © 2026 ServiHogar. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
