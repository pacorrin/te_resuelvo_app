import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

export type CustomerProviderAssignedEmailProps = {
  personName: string;
  requestNumber: string;
  serviceName: string;
  organizationName: string;
  portalUrl: string;
};

export function CustomerProviderAssignedEmail({
  personName,
  requestNumber,
  serviceName,
  organizationName,
  portalUrl,
}: CustomerProviderAssignedEmailProps) {
  const greeting = personName.trim()
    ? `Hola ${personName.trim()},`
    : "Hola,";

  return (
    <EmailLayout
      preview={`Un proveedor revisará tu solicitud ${requestNumber}`}
      title="Tu solicitud tiene un proveedor"
    >
      <Text style={paragraph}>{greeting}</Text>
      <Text style={paragraph}>
        <strong>{organizationName}</strong> adquirió tu solicitud y comenzará
        a darle seguimiento. Puedes ver el avance desde tu portal de cliente.
      </Text>
      <Section style={summaryBox}>
        <Text style={summaryLine}>
          <strong>Solicitud:</strong> {requestNumber}
        </Text>
        <Text style={summaryLine}>
          <strong>Servicio:</strong> {serviceName}
        </Text>
        <Text style={summaryLineLast}>
          <strong>Proveedor:</strong> {organizationName}
        </Text>
      </Section>
      <Section style={buttonSection}>
        <Button href={portalUrl} style={button}>
          Ver seguimiento de mi solicitud
        </Button>
      </Section>
      <Text style={hint}>
        Ingresa tu correo en la página de seguimiento para recibir un código de
        acceso e iniciar sesión.
      </Text>
    </EmailLayout>
  );
}

export default CustomerProviderAssignedEmail;

const paragraph = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const summaryBox = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  margin: "0 0 24px",
  padding: "16px 20px",
};

const summaryLine = {
  color: "#3f3f46",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
};

const summaryLineLast = {
  ...summaryLine,
  margin: "0",
};

const buttonSection = {
  margin: "0 0 16px",
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
