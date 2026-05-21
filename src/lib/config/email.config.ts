export type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromAddress: string;
  fromName: string;
  /** When true, emails are logged to console instead of sent via SMTP. */
  devLogOnly: boolean;
};

function parseSecure(value: string | undefined, port: number): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  return port === 465;
}

export function getEmailConfig(): EmailConfig {
  const host = process.env.SMTP_HOST?.trim() ?? "";
  const port = Number(process.env.SMTP_PORT) || 587;
  const isDev = process.env.NODE_ENV === "development";
  const devLogOnly = isDev && !host;

  return {
    host,
    port,
    secure: parseSecure(process.env.SMTP_SECURE, port),
    user: process.env.SMTP_USER?.trim() ?? "",
    pass: process.env.SMTP_PASS ?? "",
    fromAddress:
      process.env.EMAIL_FROM?.trim() ?? "noreply@teresuelvo.local",
    fromName: process.env.EMAIL_FROM_NAME?.trim() ?? "Te Resuelvo",
    devLogOnly,
  };
}

export function getAppBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}
