import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ChevronRight } from "lucide-react";

export interface Category {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
}

interface PopularCategoriesProps {
  categories: Category[];
}

export function PopularCategories({ categories }: PopularCategoriesProps) {
  return (
    <section id="services" className="px-4 md:px-6 py-8 md:py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Servicios populares
        </h2>
        <p className="text-muted-foreground mb-8">
          Encuentra al profesional que necesitas
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="cursor-pointer hover:border-primary transition-all group"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="link">Ver todos los servicios</Button>
        </div>
      </div>
    </section>
  );
}
