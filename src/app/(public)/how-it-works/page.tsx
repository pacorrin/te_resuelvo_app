import {
  ArrowLeft,
  Search,
  MessageCircle,
  CheckCircle,
  UserPlus,
  CreditCard,
  Bell,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PublicFooter } from "@/src/components/PublicFooter";

export default function HowItWorksPage() {
  const clientSteps = [
    {
      number: "01",
      icon: Search,
      title: "Describe tu necesidad",
      description:
        "Completa un formulario simple indicando qué servicio necesitas, dónde y cuándo. Sin registro, sin complicaciones.",
    },
    {
      number: "02",
      icon: MessageCircle,
      title: "Recibe cotizaciones",
      description:
        "Proveedores verificados te contactan directamente por WhatsApp con sus propuestas y presupuestos.",
    },
    {
      number: "03",
      icon: CheckCircle,
      title: "Compara y elige",
      description:
        "Revisa las opciones, compara precios y experiencia. Tú decides con quién trabajar.",
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "Confirma el servicio",
      description:
        "Coordina directamente con el proveedor elegido y recibe tu servicio con la calidad que esperas.",
    },
  ];

  const providerSteps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Regístrate como proveedor",
      description:
        "Crea tu perfil profesional, verifica tu identidad y define los servicios que ofreces.",
    },
    {
      number: "02",
      icon: Bell,
      title: "Recibe notificaciones de leads",
      description:
        "Te avisamos cuando hay clientes buscando servicios en tu área y especialidad.",
    },
    {
      number: "03",
      icon: CreditCard,
      title: "Paga solo por leads que aceptes",
      description:
        "Revisa los detalles del cliente y paga únicamente por los contactos que realmente te interesan.",
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Cierra más trabajos",
      description:
        "Contacta al cliente, presenta tu propuesta y convierte leads en trabajos reales.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Cómo funciona?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un proceso simple y transparente para conectar clientes con
              profesionales verificados
            </p>
          </div>

          {/* For Clients Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Para Clientes</h2>
              <p className="text-muted-foreground">
                Encuentra al profesional perfecto en 4 pasos simples
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {clientSteps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      {/* Number */}
                      <div className="text-5xl md:text-6xl font-bold text-muted-foreground/20 select-none">
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/">
                <Button size="lg">Solicitar un servicio</Button>
              </Link>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t my-16" />

          {/* For Providers Section */}
          <section className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Para Proveedores</h2>
              <p className="text-muted-foreground">
                Convierte tu experiencia en ingresos constantes
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {providerSteps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      {/* Number */}
                      <div className="text-5xl md:text-6xl font-bold text-muted-foreground/20 select-none">
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Únete como proveedor
                </Button>
              </Link>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="text-center mt-16 p-8 bg-muted/50 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">¿Listo para comenzar?</h3>
            <p className="text-muted-foreground mb-6">
              Únete a cientos de personas que ya confían en ServiHogar
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button size="lg">Solicitar servicio</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contactar soporte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
