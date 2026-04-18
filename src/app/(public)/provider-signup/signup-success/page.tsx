import {
  CheckCircle,
  Mail,
  Calendar,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PublicFooter } from "@/src/components/PublicFooter";
import Link from "next/link";
import RedirectionComponent from "./redirection-component";

export default async function SignupSuccessPage() {
  const nextSteps = [
    {
      icon: CreditCard,
      title: "Recarga créditos",
      description:
        "Añade créditos a tu cuenta para empezar a comprar leads de clientes potenciales",
      action: "Ir a recargar",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      href: "/provider-panel/billing", // Placeholder link
    },
    {
      icon: Calendar,
      title: "Completa tu perfil",
      description:
        "Agrega fotos, certificaciones y más información para destacar ante los clientes",
      action: "Completar perfil",
      color:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      href: "/provider-panel/profile", // Placeholder link
    },
    {
      icon: Mail,
      title: "Explora oportunidades",
      description:
        "Revisa los leads disponibles en tu categoría y empieza a comprar clientes",
      action: "Ver leads",
      color:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      href: "/provider-panel", // Placeholder link
    },
  ];

  const benefits = [
    "Acceso inmediato a leads de tu categoría",
    "Panel de control para gestionar tus clientes",
    "Soporte 24/7 para cualquier duda",
    "Notificaciones de nuevas oportunidades",
    "Sistema de garantía de calidad de leads",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-balance">
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Datos</span>
              </div>
              <div className="w-16 h-0.5 bg-green-600" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Verificación</span>
              </div>
              <div className="w-16 h-0.5 bg-green-600" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Completado</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3">¡Registro completado!</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Tu cuenta ha sido creada exitosamente
            </p>
            <p className="text-muted-foreground">
              Ya eres parte de la red de proveedores de Te Resuelvo. Te
              redirigiremos a la pantalla de inicio de sesión en automatico en
              unos momentos.
            </p>
            <RedirectionComponent />
          </div>

          {/* Welcome Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    Revisa tu correo electrónico
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Te hemos enviado un email de bienvenida con información
                    importante sobre cómo empezar a usar la plataforma. También
                    incluye tu guía de inicio rápido.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Próximos pasos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nextSteps.map((step, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${step.color}`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  {/* <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(step.href)}
                    >
                      {step.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent> */}
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>¿Qué incluye tu cuenta?</CardTitle>
              <CardDescription>
                Beneficios de ser proveedor en Te Resuelvo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/provider-signup">
              <Button size="lg" className="sm:min-w-[200px]">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <Card className="mt-8 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">
                  ¿Necesitas ayuda para empezar?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nuestro equipo está disponible para ayudarte con cualquier
                  duda
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/how-it-works">
                    <Button variant="outline" size="sm">
                      Ver guía de inicio
                    </Button>
                  </Link>
                  <Link href="/contacto">
                    <Button variant="outline" size="sm">
                      Contactar soporte
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button variant="outline" size="sm">
                      Cómo funciona
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
