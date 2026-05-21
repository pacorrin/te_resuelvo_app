import type { ReactElement } from "react";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { getAppBaseUrl, getEmailConfig } from "@/src/lib/config/email.config";
import { CustomerTenderAccessCodeEmail } from "@/src/emails/CustomerTenderAccessCodeEmail";
import { CustomerProviderAssignedEmail } from "@/src/emails/CustomerProviderAssignedEmail";
import { CustomerTenderCreatedEmail } from "@/src/emails/CustomerTenderCreatedEmail";
import { ProviderTenderPurchasedEmail } from "@/src/emails/ProviderTenderPurchasedEmail";
import { ProviderVerificationCodeEmail } from "@/src/emails/ProviderVerificationCodeEmail";
import { getErrorMessage } from "@/src/lib/utils/error";

type SendMailInput = {
  to: string;
  subject: string;
  react: ReactElement;
  plainTextHint?: string;
};

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null =
  null;

function getTransporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
  if (transporter) return transporter;
  const config = getEmailConfig();
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth:
      config.user && config.pass
        ? { user: config.user, pass: config.pass }
        : undefined,
  });
  return transporter;
}

export class EmailService {
  static async sendMail(input: SendMailInput): Promise<void> {
    const config = getEmailConfig();
    const html = await render(input.react);
    const text =
      input.plainTextHint ??
      html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (config.devLogOnly) {
      console.info("[EmailService] Dev log only — email not sent via SMTP");
      console.info(`  To: ${input.to}`);
      console.info(`  Subject: ${input.subject}`);
      console.info(`  Text: ${text}`);
      return;
    }

    if (!config.host) {
      throw new Error("SMTP_HOST no está configurado.");
    }

    await getTransporter().sendMail({
      from: `"${config.fromName}" <${config.fromAddress}>`,
      to: input.to,
      subject: input.subject,
      html,
      text,
    });
  }

  static async sendCustomerTenderAccessCode(params: {
    to: string;
    code: string;
    requestNumber: string;
  }): Promise<boolean> {
    const portalUrl = `${getAppBaseUrl()}/seguimiento`;
    try {
      await this.sendMail({
        to: params.to,
        subject: `Código de acceso — solicitud ${params.requestNumber}`,
        react: CustomerTenderAccessCodeEmail({
          code: params.code,
          requestNumber: params.requestNumber,
          portalUrl,
        }),
        plainTextHint: `Tu código de acceso para la solicitud ${params.requestNumber} es: ${params.code}. Ingresa en ${portalUrl}`,
      });
      return true;
    } catch (error) {
      console.error("Error sending customer tender access code email:", error);
      console.error(getErrorMessage(error));
      return false;
    }
  }

  static async sendCustomerTenderCreated(params: {
    to: string;
    personName: string;
    requestNumber: string;
    serviceName: string;
    accessCode: string;
  }): Promise<boolean> {
    const portalUrl = `${getAppBaseUrl()}/seguimiento`;
    try {
      await this.sendMail({
        to: params.to,
        subject: `Solicitud registrada — ${params.requestNumber}`,
        react: CustomerTenderCreatedEmail({
          personName: params.personName,
          requestNumber: params.requestNumber,
          serviceName: params.serviceName,
          accessCode: params.accessCode,
          portalUrl,
        }),
        plainTextHint: `Tu solicitud ${params.requestNumber} (${params.serviceName}) fue registrada. Código de acceso: ${params.accessCode}. Seguimiento: ${portalUrl}`,
      });
      return true;
    } catch (error) {
      console.error("Error sending customer tender created email:", error);
      console.error(getErrorMessage(error));
      return false;
    }
  }

  static async sendCustomerProviderAssigned(params: {
    to: string;
    personName: string;
    requestNumber: string;
    serviceName: string;
    organizationName: string;
  }): Promise<boolean> {
    const portalUrl = `${getAppBaseUrl()}/seguimiento`;
    try {
      await this.sendMail({
        to: params.to,
        subject: `Un proveedor atenderá tu solicitud ${params.requestNumber}`,
        react: CustomerProviderAssignedEmail({
          personName: params.personName,
          requestNumber: params.requestNumber,
          serviceName: params.serviceName,
          organizationName: params.organizationName,
          portalUrl,
        }),
        plainTextHint: `${params.organizationName} adquirió tu solicitud ${params.requestNumber}. Seguimiento: ${portalUrl}`,
      });
      return true;
    } catch (error) {
      console.error("Error sending customer provider assigned email:", error);
      console.error(getErrorMessage(error));
      return false;
    }
  }

  static async sendProviderTenderPurchased(params: {
    to: string;
    buyerName?: string | null;
    requestNumber: string;
    organizationName: string;
    serviceName: string;
    description: string;
    personName: string;
    personPhone: string;
    address: string;
    zipcode: string;
    amountPaid: number;
    followUpUrl: string;
  }): Promise<boolean> {
    const amountLabel = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(params.amountPaid);
    try {
      await this.sendMail({
        to: params.to,
        subject: `Lead comprado — ${params.requestNumber}`,
        react: ProviderTenderPurchasedEmail({
          buyerName: params.buyerName,
          requestNumber: params.requestNumber,
          organizationName: params.organizationName,
          serviceName: params.serviceName,
          description: params.description,
          personName: params.personName,
          personPhone: params.personPhone,
          address: params.address,
          zipcode: params.zipcode,
          amountPaid: amountLabel,
          followUpUrl: params.followUpUrl,
        }),
        plainTextHint: `Compra confirmada del lead ${params.requestNumber} por ${amountLabel}. Seguimiento: ${params.followUpUrl}`,
      });
      return true;
    } catch (error) {
      console.error("Error sending provider tender purchased email:", error);
      console.error(getErrorMessage(error));
      return false;
    }
  }

  static async sendProviderVerificationCode(params: {
    to: string;
    code: string;
    name?: string | null;
    signupHash: string;
  }): Promise<boolean> {
    const verificationUrl = `${getAppBaseUrl()}/provider-signup/email-verification?h=${encodeURIComponent(params.signupHash)}&email=${encodeURIComponent(params.to)}`;
    try {
      await this.sendMail({
        to: params.to,
        subject: "Verifica tu correo — Te Resuelvo",
        react: ProviderVerificationCodeEmail({
          code: params.code,
          name: params.name,
          verificationUrl,
        }),
        plainTextHint: `Tu código de verificación es: ${params.code}. Verifica en ${verificationUrl}`,
      });
      return true;
    } catch (error) {
      console.error("Error sending provider verification email:", error);
      console.error(getErrorMessage(error));
      return false;
    }
  }
}
