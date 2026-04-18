import { cn } from "@/src/lib/utils";
import { Check } from "lucide-react";

export type FormStepperStep = {
  label: string;
  description?: string;
};

export type FormStepperProps = {
  steps: FormStepperStep[];
  currentStep: number;
  className?: string;
};

export function FormStepper({ steps, currentStep, className }: FormStepperProps) {
  return (
    <nav aria-label="Progreso del formulario" className={cn("w-full", className)}>
      <ol className="flex items-start gap-0">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className={cn("flex min-w-0 items-start", !isLast && "pr-2 flex-1")}
            >
              <div className="flex w-full min-w-0 flex-col items-center gap-1.5">
                <div className="flex w-full items-center gap-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                      isComplete &&
                        "border-primary bg-primary text-primary-foreground",
                      isCurrent &&
                        "border-primary bg-primary/10 text-primary",
                      !isComplete && !isCurrent && "border-muted-foreground/25 text-muted-foreground",
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {!isLast ? (
                    <div
                      className={cn(
                        "h-0.5 min-w-[12px] flex-1 rounded-full transition-colors",
                        index < currentStep ? "bg-primary" : "bg-muted-foreground/20",
                      )}
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <p
                    className={cn(
                      "text-xs text-centerfont-semibold leading-tight",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description ? (
                    <p className="mt-0.5 hidden text-[11px] leading-snug text-muted-foreground sm:block">
                      {step.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
