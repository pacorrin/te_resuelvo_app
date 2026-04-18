import { Wrench, Droplet, Zap, Paintbrush } from "lucide-react";
import { PublicFooter } from "@/src/components/PublicFooter";
import { PublicHeader } from "@/src/components/PublicHeader";
import { HeroSection } from "./HeroSection";
import { ValueProps } from "./ValueProps";
import { PopularCategories } from "./PopularCategories";
import { ProviderCTA } from "./ProviderCTA";
import { Testimonials } from "./Testimonials";
import { FaqSection } from "./FaqSection";

export default function Home() {
  const categories = [
    {
      icon: Wrench,
      name: "Plomería",
      description: "15 proveedores verificados",
    },
    {
      icon: Zap,
      name: "Electricidad",
      description: "12 proveedores verificados",
    },
    {
      icon: Paintbrush,
      name: "Pintura",
      description: "18 proveedores verificados",
    },
    {
      icon: Droplet,
      name: "Limpieza",
      description: "22 proveedores verificados",
    },
  ];

  return (
    <div className="max-w-full mx-auto">
      <PublicHeader />
      <HeroSection />
      <ValueProps />
      <PopularCategories categories={categories} />
      <ProviderCTA />
      <Testimonials />
      <FaqSection />
      <PublicFooter />
    </div>
  );
}
