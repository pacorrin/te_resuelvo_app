"use client";

import { useActionState, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { PublicHeader } from "@/src/components/PublicHeader";
import { authenticate } from "@/src/lib/actions/auth.actions";
import Link from "next/link";

export default function LoginPage() {
  // const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Login Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 bg-gradient-to-b from-muted/50 to-background">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">
                Iniciar sesión como proveedor
              </CardTitle>
              <CardDescription>
                Accede a tu panel para gestionar leads y solicitudes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={dispatch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-zinc-300 dark:border-zinc-700 bg-background"
                    />
                    <span className="text-muted-foreground">Recordarme</span>
                  </label>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    aria-disabled={isPending}
                  >
                    {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                  {errorMessage && (
                    <div className="p-2 bg-destructive/15 text-destructive text-sm rounded-md flex items-center gap-2">
                      <p className="text-center w-full">{errorMessage}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 text-center text-sm">
                  <span className="text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                  </span>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm font-semibold"
                    asChild
                  >
                    <Link href="/provider-signup">
                      Regístrate como proveedor
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="mt-8 space-y-4">
            <p className="text-sm text-center text-muted-foreground font-medium">
              Beneficios de ser proveedor en Te Resuelvo:
            </p>
            <div className="grid grid-cols-1 gap-3 max-w-fit mx-auto">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <span className="text-muted-foreground">
                  Solo pagas por leads calificados
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <span className="text-muted-foreground">
                  Sin comisiones mensuales ni contratos
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <span className="text-muted-foreground">
                  Recibe solicitudes en tu área de cobertura
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
