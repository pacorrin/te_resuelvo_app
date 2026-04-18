import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    initials: "MA",
    name: "María Álvarez",
    location: "Ciudad de México",
    text: "Necesitaba un plomero urgente y en menos de 2 horas ya tenía 3 presupuestos. El proceso fue súper rápido y encontré un profesional excelente.",
  },
  {
    initials: "CR",
    name: "Carlos Ramírez",
    location: "Guadalajara",
    text: "Me encantó que no tuve que registrarme ni dar mil datos. Solo llené el formulario y los proveedores me contactaron por WhatsApp. Muy práctico.",
  },
  {
    initials: "LS",
    name: "Laura Sánchez",
    location: "Monterrey",
    text: "La calidad de los profesionales es excelente. Todos estaban verificados y me sentí segura al contratarlos. Definitivamente lo recomiendo.",
  },
  {
    initials: "JP",
    name: "Jorge Pérez",
    location: "Puebla",
    text: "Contraté un servicio de electricidad y el profesional llegó puntual, con todas las herramientas necesarias. Muy profesional y precio justo.",
  },
  {
    initials: "AM",
    name: "Ana Martínez",
    location: "Querétaro",
    text: "Excelente servicio. Me contactaron varios proveedores en poco tiempo y pude comparar precios. El que elegí hizo un trabajo impecable.",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 md:px-6 py-12 md:py-16 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-muted-foreground">
            Experiencias reales de personas que encontraron su profesional ideal
          </p>
        </div>
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {testimonial.initials}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {testimonial.location}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.text}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 md:-left-16" />
          <CarouselNext className="-right-12 md:-right-16" />
        </Carousel>
      </div>
    </section>
  );
}
