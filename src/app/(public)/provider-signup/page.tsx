import { SignupForm } from "./signup-form";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PublicFooter } from "@/src/components/PublicFooter";

export default function ProviderSignupPage() {
  return (
    <div className="flex flex-col bg-background">
      <PublicHeader />

      {/* Main Content */}
      <main className="min-h-screen flex-1 px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center text-balance">
            <h1 className="text-3xl font-bold mb-2">Registro de Proveedor</h1>
            <p className="text-muted-foreground">
              Completa tus datos para empezar a recibir oportunidades de negocio
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <span className="text-sm font-medium">Datos</span>
              </div>
              <div className="w-16 h-0.5 bg-muted" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="text-sm text-muted-foreground">
                  Verificación
                </span>
              </div>
              <div className="w-16 h-0.5 bg-muted" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span className="text-sm text-muted-foreground">
                  Completado
                </span>
              </div>
            </div>
          </div>

          <SignupForm />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
