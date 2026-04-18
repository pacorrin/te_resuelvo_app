"use client";

import { useState, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResendCode } from "./resend-code";
import { _verifyCode } from "@/src/lib/actions/user.actions";
import { cn } from "@/src/lib/utils";
import { Spinner } from "@/src/components/ui/spinner";

export function CodeValidationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Solo tomar el último carácter
    setCode(newCode);

    if (error) setError("");

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    const fullCode = newCode.join("");
    if (fullCode.length === 6) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Manejar backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    if (error) setError("");

    // Focus en el siguiente input vacío o el último
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }

    // Check if complete
    if (newCode.join("").length === 6) {
      handleVerify(newCode.join(""));
    }
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    setError("");

    const signupHash = searchParams.get("h") || "";
    const validationResult = await _verifyCode(signupHash, code);

    if (validationResult?.data?.isCodeValid) {
      router.push(`/provider-signup/signup-success`);
    } else {
      setError("Código no válido");
      setCode(["", "", "", "", "", ""]);
      setIsVerifying(false);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className={cn("flex justify-center gap-2", isVerifying && "hidden")}>
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-14 text-center text-xl font-semibold"
            disabled={isVerifying}
          />
        ))}
      </div>

      <div className="flex justify-center">
        {isVerifying && <Spinner className="size-12" />}
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="flex justify-center items-center gap-2"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ResendCode />
    </div>
  );
}

CodeValidationForm.displayName = "CodeValidationForm";
