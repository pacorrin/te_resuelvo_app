import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast as toastSonner } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToastOptions {
  message?: string;
  type?: "success" | "error" | "warning" | "info";
  position?: "top-center" | "top-right" | "bottom-center" | "bottom-right";
  richColors?: boolean;
  style?: React.CSSProperties;
  duration?: number;
}

const toastTypeStyles = {
  success: {
    background: "var(--success-background)",
    color: "var(--success)",
    border: "var(--success-background)",
  },
  error: {
    background: "var(--error-background)",
    color: "var(--error)",
    border: "var(--error-background)",
  },
  warning: {
    background: "var(--warning-background)",
    color: "var(--warning)",
    border: "var(--warning-background)",
  },
  info: {
    background: "var(--info-background)",
    color: "var(--info)",
    border: "var(--info-background)",
  },
};

export function toast({
  message,
  type,
  position,
  richColors,
  style,
  duration,
}: ToastOptions) {
  toastSonner[type!](message, {
    position: position || "top-center",
    richColors: richColors || false,
    style: { ...toastTypeStyles[type!], ...style },
    duration: duration || 3000,
  });
}

export function toastSuccess(message: string, options?: ToastOptions) {
  toast({ message, type: "success", ...options });
}

export function toastError(message: string, options?: ToastOptions) {
  toast({ message, type: "error", ...options });
}

export function toastWarning(message: string, options?: ToastOptions) {
  toast({ message, type: "warning", ...options });
}

export function toastInfo(message: string, options?: ToastOptions) {
  toast({ message, type: "info", ...options });
}
