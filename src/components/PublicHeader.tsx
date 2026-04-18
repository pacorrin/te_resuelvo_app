import Link from "next/link";
import { Button } from "@/src/components/ui/button";
// import { ThemeToggle } from "./ThemeToggle";

export type PublicNavTarget =
  | "home"
  | "category"
  | "provider"
  | "dashboard"
  | "success"
  | "login"
  | "contact"
  | "how-it-works";

export function PublicHeader() {
  return (
    <header className="bg-background border-b px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Te Resuelvo" width={140} />
          </Link>
          {/* <nav className="flex items-center gap-3 md:gap-6">
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link href="/">Inicio</Link>
            </Button>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link href="/services">Servicios</Link>
            </Button>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link href="/how-it-works">Cómo funciona</Link>
            </Button>
            {/* <ThemeToggle /> 
            <Button variant="outline" className="text-sm md:text-base" asChild>
              <Link href="/login">
                <span className="hidden sm:inline">Soy proveedor</span>
                <span className="sm:hidden">Proveedor</span>
              </Link>
            </Button>
          </nav> */}
        </div>
        <nav className="flex items-center gap-3 md:gap-6">
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/">Inicio</Link>
          </Button>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/services">Servicios</Link>
          </Button>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/how-it-works">Cómo funciona</Link>
          </Button>
          {/* <ThemeToggle /> */}
          <Button variant="outline" className="text-sm md:text-base" asChild>
            <Link href="/login">
              <span className="hidden sm:inline">Soy proveedor</span>
              <span className="sm:hidden">Proveedor</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
