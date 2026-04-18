import { Button } from "@/src/components/ui/button";
import { ChevronRight } from "lucide-react";

export function ProviderCTA() {
  return (
    <section className="px-4 md:px-6 py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          ¿Eres proveedor de servicios?
        </h2>
        <p className="text-primary-foreground/80 mb-8 text-base md:text-lg">
          Recibe clientes reales, paga solo por leads calificados. Sin
          contratos, sin comisiones mensuales.
        </p>
        <Button size="lg" variant="secondary">
          Comenzar ahora
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}
