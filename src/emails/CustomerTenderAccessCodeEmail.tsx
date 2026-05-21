import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

export type CustomerTenderAccessCodeEmailProps = {
  code: string;
  requestNumber: string;
  portalUrl: string;
};

export function CustomerTenderAccessCodeEmail({
  code,
  requestNumber,
  portalUrl,
}: CustomerTenderAccessCodeEmailProps) {
  return (
    <EmailLayout
      preview={`Tu código de acceso para la solicitud ${requestNumber}`}
      title="Código de acceso a tu solicitud"
    >
      <Text style={paragraph}>
        Usa este código de 6 dígitos para ingresar al seguimiento de tu
        solicitud <strong>{requestNumber}</strong>. El código es de un solo
        uso; al iniciar sesión se generará uno nuevo.
      </Text>
      <Section style={codeBox}>
        <Text style={codeText}>{code}</Text>
      </Section>
      <Section style={buttonSection}>
        <Button href={portalUrl} style={button}>
          Ir a seguimiento
        </Button>
      </Section>
      <Text style={hint}>
        Si no solicitaste este código, puedes ignorar este correo.
      </Text>
    </EmailLayout>
  );
}

export default CustomerTenderAccessCodeEmail;

const paragraph = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 20px",
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
