import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

type EmailLayoutProps = {
  preview: string;
  title: string;
  children: ReactNode;
};

export function EmailLayout({ preview, title, children }: EmailLayoutProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>Te Resuelvo</Heading>
          </Section>
          <Section style={content}>
            <Heading as="h2" style={titleStyle}>
              {title}
            </Heading>
            {children}
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Este correo fue enviado automáticamente. No respondas a este
            mensaje.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: "0",
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "0",
};

const header = {
  backgroundColor: "#0f172a",
  borderRadius: "8px 8px 0 0",
  padding: "20px 32px",
};

const brand = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
};

const content = {
  padding: "28px 32px",
};

const titleStyle = {
  color: "#18181b",
  fontSize: "20px",
  fontWeight: "600",
  lineHeight: "28px",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "0 32px",
};

const footer = {
  color: "#71717a",
  fontSize: "12px",
  lineHeight: "18px",
  padding: "16px 32px 24px",
  margin: "0",
};
