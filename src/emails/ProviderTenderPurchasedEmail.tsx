import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./components/EmailLayout";

export type ProviderTenderPurchasedEmailProps = {
  buyerName?: string | null;
  requestNumber: string;
  organizationName: string;
  serviceName: string;
  description: string;
  personName: string;
  personPhone: string;
  address: string;
  zipcode: string;
  amountPaid: string;
  followUpUrl: string;
};

export function ProviderTenderPurchasedEmail({
  buyerName,
  requestNumber,
  organizationName,
  serviceName,
  description,
  personName,
  personPhone,
  address,
  zipcode,
  amountPaid,
  followUpUrl,
}: ProviderTenderPurchasedEmailProps) {
  const greeting = buyerName?.trim()
    ? `Hola ${buyerName.trim()},`
    : "Hola,";

  return (
    <EmailLayout
      preview={`Compra confirmada — lead ${requestNumber}`}
      title="Compra de lead confirmada"
    >
      <Text style={paragraph}>{greeting}</Text>
      <Text style={paragraph}>
        La compra del lead <strong>{requestNumber}</strong> para{" "}
        <strong>{organizationName}</strong> se completó correctamente. A
        continuación los datos del cliente y la solicitud.
      </Text>
      <Section style={summaryBox}>
        <Text style={summaryLine}>
          <strong>Lead:</strong> {requestNumber}
        </Text>
        <Text style={summaryLine}>
          <strong>Servicio:</strong> {serviceName}
        </Text>
        <Text style={summaryLine}>
          <strong>Monto pagado:</strong> {amountPaid}
        </Text>
        <Text style={summaryLine}>
          <strong>Cliente:</strong> {personName}
        </Text>
        <Text style={summaryLine}>
          <strong>Teléfono:</strong> {personPhone}
        </Text>
        <Text style={summaryLine}>
          <strong>Dirección:</strong> {address}
          {zipcode ? ` · CP ${zipcode}` : ""}
        </Text>
        <Text style={summaryLineLast}>
          <strong>Descripción:</strong> {description}
        </Text>
      </Section>
      <Section style={buttonSection}>
        <Button href={followUpUrl} style={button}>
          Abrir seguimiento del lead
        </Button>
      </Section>
      <Text style={hint}>
        Gestiona citas, cotizaciones e incidencias desde el panel de proveedor.
      </Text>
    </EmailLayout>
  );
}

export default ProviderTenderPurchasedEmail;

const paragraph = {
  color: "#3f3f46",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const summaryBox = {
  backgroundColor: "#f4f4f5",
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
