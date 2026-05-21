import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

export type CustomerTenderCreatedEmailProps = {
  personName: string;
  requestNumber: string;
  serviceName: string;
  accessCode: string;
  portalUrl: string;
};

export function CustomerTenderCreatedEmail({
  personName,
  requestNumber,
  serviceName,
  accessCode,
  portalUrl,
}: CustomerTenderCreatedEmailProps) {
  const greeting = personName.trim()
    ? `Hola ${personName.trim()},`
    : "Hola,";

  return (
    <EmailLayout
      preview={`Recibimos tu solicitud ${requestNumber}`}
      title="Tu solicitud fue registrada"
    >
      <Text style={paragraph}>{greeting}</Text>
      <Text style={paragraph}>
        Recibimos tu solicitud de servicio en Te Resuelvo. Un proveedor podrá
        revisarla pronto.
      </Text>
      <Section style={summaryBox}>
        <Text style={summaryLine}>
          <strong>Número de solicitud:</strong> {requestNumber}
        </Text>
        <Text style={summaryLine}>
          <strong>Servicio:</strong> {serviceName}
        </Text>
      </Section>
      <Text style={paragraph}>
        Para dar seguimiento, ingresa tu correo en la página de seguimiento y
        recibirás un código de acceso para ingresar.
      </Text>
      <Section style={buttonSection}>
        <Button href={portalUrl} style={button}>
          Ver seguimiento de mi solicitud
        </Button>
      </Section>
      <Text style={hint}>
        Cada código es de un solo uso. Tras iniciar sesión recibirás uno nuevo
        para el próximo acceso.
      </Text>
    </EmailLayout>
  );
}

export default CustomerTenderCreatedEmail;

const paragraph = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const summaryBox = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  margin: "0 0 20px",
  padding: "16px 20px",
};

const summaryLine = {
  color: "#3f3f46",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
};

const codeBox = {
  backgroundColor: "#eff6ff",
  borderRadius: "8px",
  margin: "0 0 24px",
  padding: "20px",
  textAlign: "center" as const,
};

const codeText = {
  color: "#1e3a8a",
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
