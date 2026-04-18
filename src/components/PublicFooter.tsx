"use client";

import Link from "next/link";

export type PublicNavTarget =
  | "home"
  | "category"
  | "provider"
  | "dashboard"
  | "success"
  | "login"
  | "contact"
  | "how-it-works";

interface PublicFooterProps {
  onNavigate?: (to: PublicNavTarget) => void;
}

export function PublicFooter({ onNavigate }: PublicFooterProps) {
  return (
    <footer className="bg-background border-t px-4 md:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-3">Servicios</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Plomería</li>
              <li>Electricidad</li>
              <li>Pintura</li>
              <li>Limpieza</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Para proveedores</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Cómo funciona</li>
              <li>Precios</li>
              <li>Registro</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Acerca de</li>
              <li>
                {onNavigate ? (
                  <button
                    type="button"
                    onClick={() => onNavigate("contact")}
                    className="hover:text-foreground transition-colors"
                  >
                    Contacto
                  </button>
                ) : (
                  <Link
                    href="/contacto"
                    className="hover:text-foreground transition-colors"
                  >
                    Contacto
                  </Link>
                )}
              </li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Términos</li>
              <li>Privacidad</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t text-center text-sm text-muted-foreground">
          © 2026 Te Resuelvo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
