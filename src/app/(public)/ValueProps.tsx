import { Shield, Clock, Star } from "lucide-react";

export function ValueProps() {
  return (
    <section className="px-4 md:px-6 py-24 md:py-24 bg-background border-b"
   
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Proveedores verificados</h3>
          <p className="text-sm text-muted-foreground">
            Todos nuestros profesionales pasan un proceso de validación
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Respuesta rápida</h3>
          <p className="text-sm text-muted-foreground">
            Contacto directo por WhatsApp sin intermediarios
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Sin registro</h3>
          <p className="text-sm text-muted-foreground">
            Encuentra y contacta profesionales en segundos
          </p>
        </div>
      </div>
    </section>
  );
}


