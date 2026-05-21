"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Spinner } from "@/src/components/ui/spinner";
import {
  _requestCustomerTenderAccessCode,
  _verifyCustomerTenderAccess,
} from "@/src/lib/actions/customer-portal.actions";
import { toastError, toastSuccess } from "@/src/lib/utils";

type Step = "email" | "code";

export function CustomerAccessForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const requestCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toastError("Ingresa tu correo electrónico.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await _requestCustomerTenderAccessCode(trimmedEmail);
      if (result.success) {
        setEmail(trimmedEmail);
        setCode(["", "", "", "", "", ""]);
        setStep("code");
        toastSuccess(
          "Si el correo está registrado, ya puedes usar tu código de acceso.",
        );
      } else {
        toastError(result.error ?? "No se pudo enviar el código.");
      }
    } catch {
      toastError("No se pudo enviar el código.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    const full = next.join("");
    if (full.length === 6) {
      void verifyCode(full);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const next = [...code];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setCode(next);
    const full = next.join("");
    if (full.length === 6) {
      void verifyCode(full);
    }
  };

  const verifyCode = async (codeValue?: string) => {
    const fullCode = codeValue ?? code.join("");
    if (fullCode.length !== 6) {
      toastError("Ingresa el código de 6 dígitos.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await _verifyCustomerTenderAccess(email, fullCode);
      if (result.success) {
        router.push("/seguimiento/dashboard");
        router.refresh();
      } else {
        toastError(result.error ?? "Correo o código incorrectos.");
      }
    } catch {
      toastError("No se pudo verificar el acceso.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "email") {
    return (
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void requestCode();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="customer-email">Correo electrónico</Label>
          <Input
            id="customer-email"
            type="email"
            autoComplete="email"
            placeholder="ejemplo@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
          <p className="text-xs text-muted-foreground">
            Te enviaremos un código de 6 dígitos para acceder a tu solicitud.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="mr-2 size-4" />
              Enviando código…
            </>
          ) : (
            "Enviar código de acceso"
          )}
        </Button>
      </form>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        void verifyCode();
      }}
    >
      <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
        <p className="text-muted-foreground">Código enviado a</p>
        <p className="font-medium text-foreground">{email}</p>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-xs"
          disabled={submitting}
          onClick={() => {
            setStep("email");
            setCode(["", "", "", "", "", ""]);
          }}
        >
          Cambiar correo
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Código de acceso (6 dígitos)</Label>
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="h-12 w-10 text-center text-lg font-semibold"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={submitting}
              aria-label={`Dígito ${index + 1} del código`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Código de un solo uso. Tras iniciar sesión se generará uno nuevo para
          el próximo acceso.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner className="mr-2 size-4" />
              Verificando…
            </>
          ) : (
            "Acceder a mi solicitud"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={submitting}
          onClick={() => void requestCode()}
        >
          Reenviar código
        </Button>
      </div>
    </form>
  );
}
