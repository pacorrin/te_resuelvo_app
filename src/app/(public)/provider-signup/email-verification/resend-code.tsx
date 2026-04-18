"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { _resendVerificationCode } from "@/src/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ResendCode() {
  const [countdown, setCountdown] = useState(60);
  const searchParams = useSearchParams();
  const canResend = countdown === 0;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendCode = async () => {
    const signupHash = searchParams.get("h") || "";
    const result = await _resendVerificationCode(signupHash);
    if (!result?.data?.codeSent) {
      toast.error("Error al reenviar el código", {
        position: "top-center",
        richColors: true,
      });
      return;
    }

    toast.success("Código reenviado exitosamente", {
      position: "top-center",
      richColors: true,
    });
  };

  const handleResend = () => {
    handleResendCode();
    setCountdown(60);
  };

  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground">¿No recibiste el código?</p>
      {canResend ? (
        <Button variant="link" className="p-0 h-auto" onClick={handleResend}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reenviar código
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Puedes solicitar un nuevo código en{" "}
          <span className="font-semibold">{countdown}s</span>
        </p>
      )}
    </div>
  );
}
