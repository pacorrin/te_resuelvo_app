import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

export type ProviderVerificationCodeEmailProps = {
  code: string;
  name?: string | null;
  verificationUrl: string;
};

export function ProviderVerificationCodeEmail({
  code,
  name,
  verificationUrl,
}: ProviderVerificationCodeEmailProps) {
  const greeting = name?.trim()
    ? `Hola ${name.trim()},`
    : "Hola,";

  return (
    <EmailLayout
      preview="Verifica tu correo para completar tu registro"
      title="Verifica tu correo electrónico"
    >
      <Text style={paragraph}>{greeting}</Text>
      <Text style={paragraph}>
        Ingresa este código de 6 dígitos en la página de verificación para
        activar tu cuenta de proveedor en Te Resuelvo.
      </Text>
      <Section style={codeBox}>
        <Text style={codeText}>{code}</Text>
      </Section>
      <Section style={buttonSection}>
        <Button href={verificationUrl} style={button}>
          Verificar correo
        </Button>
      </Section>
      <Text style={hint}>
        El código expira al completar el registro. Si no creaste una cuenta,
        ignora este mensaje.
      </Text>
    </EmailLayout>
  );
}

export default ProviderVerificationCodeEmail;

const paragraph = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const codeBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  margin: "0 0 24px",
  padding: "20px",
  textAlign: "center" as const,
};

const codeText = {
  color: "#0f172a",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "8px",
  margin: "0",
};

const buttonSection = {
  margin: "0 0 20px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  padding: "12px 24px",
  textDecoration: "none",
};

const hint = {
  color: "#71717a",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
};
