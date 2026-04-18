"use client";

import {
  Wrench,
  Droplet,
  Zap,
  Paintbrush,
  Hammer,
  Truck,
  Scissors,
  Thermometer,
  ChevronRight,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { PublicHeader } from "@/src/components/PublicHeader";
import { PublicFooter } from "@/src/components/PublicFooter";

export default function ServicesPage() {
  const categories = [
    {
      icon: Wrench,
      name: "Plomería",
      description:
        "Instalaciones, reparaciones de fugas, destapes y mantenimiento general de tuberías.",
      slug: "plomeria",
    },
    {
      icon: Zap,
      name: "Electricidad",
      description:
        "Cableado, reparación de cortos, instalaciones de luminarias y tableros eléctricos.",
      slug: "electricidad",
    },
    {
      icon: Paintbrush,
      name: "Pintura",
      description:
        "Pintura de interiores y exteriores, impermeabilización y acabados decorativos.",
      slug: "pintura",
    },
    {
      icon: Droplet,
      name: "Limpieza",
      description:
        "Limpieza profunda de hogar, oficinas, tapicería y desinfección de espacios.",
      slug: "limpieza",
    },
    {
      icon: Hammer,
      name: "Carpintería",
      description:
        "Fabricación y reparación de muebles, puertas, ventanas y estructuras de madera.",
      slug: "carpinteria",
    },
    {
      icon: Thermometer,
      name: "Aires Acondicionados",
      description:
        "Instalación y mantenimiento de aires acondicionados, calefacción y ventilación.",
      slug: "aires-acondicionados",
    },
    {
      icon: Scissors,
      name: "Jardinería",
      description:
        "Poda, diseño de jardines, mantenimiento de áreas verdes y control de plagas.",
      slug: "jardineria",
    },
    {
      icon: Truck,
      name: "Fletes y Mudanzas",
      description:
        "Servicio de transporte de carga, mudanzas locales y foráneas con personal calificado.",
      slug: "fletes",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="bg-muted/30 py-12 md:py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Encuentra profesionales verificados para cada necesidad de tu
              hogar en un solo lugar.
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                className="pl-10 h-12 text-lg"
                placeholder="¿Qué servicio estás buscando?"
              />
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  href={`/category/${category.slug}`}
                  key={category.name}
                  className="group"
                >
                  <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <category.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="flex items-center justify-between mb-2">
                            {category.name}
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                          </CardTitle>
                          <CardDescription className="text-base">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center bg-muted/50 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Dinos qué necesitas y nosotros nos encargamos de encontrar al
                profesional adecuado para tu problema.
              </p>
              <Button size="lg" asChild>
                <Link href="/">Solicitar servicio personalizado</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
