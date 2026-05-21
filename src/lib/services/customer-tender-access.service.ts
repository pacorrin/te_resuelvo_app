import crypto from "node:crypto";
import { EmailService } from "@/src/lib/services/email.service";
import { getTenderNumber } from "@/src/lib/utils/tender.utils";
import { TenderRepository } from "@/src/lib/repositories/Tender.repo";
import {
  clearCustomerTenderSession,
  getCustomerTenderSession,
  setCustomerTenderSession,
} from "@/src/lib/auth/customer-tender-session";

export class CustomerTenderAccessService {
  static generateAccessCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async assignAccessCodeForTender(tenderId: number): Promise<string> {
    const code = this.generateAccessCode();
    await TenderRepository.updateTender(tenderId, {
      customerAccessCode: code,
    });
    return code;
  }

  /** Invalidates the code used to log in and stores a new one for the next access. */
  static async rotateAccessCodeForTender(tenderId: number): Promise<void> {
    await this.assignAccessCodeForTender(tenderId);
  }

  /**
   * Generates a fresh access code for the customer's latest tender.
   * Email delivery is not wired yet; code is persisted for verification.
   */
  static async requestAccessCode(email: string): Promise<void> {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      return;
    }

    const tender =
      await TenderRepository.findLatestByCustomerEmail(normalizedEmail);
    if (!tender) {
      return;
    }

    const code = await this.assignAccessCodeForTender(tender.id);
    await EmailService.sendCustomerTenderAccessCode({
      to: normalizedEmail,
      code,
      requestNumber: getTenderNumber(tender.id),
    });
  }

  static async verifyAccess(
    email: string,
    code: string,
  ): Promise<{ tenderId: number; customerId: number } | null> {
    const normalizedEmail = email.trim();
    const normalizedCode = code.trim();
    if (!normalizedEmail || normalizedCode.length !== 6) {
      return null;
    }
    if (!/^\d{6}$/.test(normalizedCode)) {
      return null;
    }

    const tenders = await TenderRepository.findByCustomerEmailAndAccessCode(
      normalizedEmail,
      normalizedCode,
    );
    if (tenders.length === 0) {
      return null;
    }

    const tender = tenders[0];
    if (!tender.customerId) {
      return null;
    }

    return {
      tenderId: tender.id,
      customerId: tender.customerId,
    };
  }

  static async issueSession(
    tenderId: number,
    customerId: number,
  ): Promise<void> {
    await setCustomerTenderSession(tenderId, customerId);
  }

  static async completeLogin(match: {
    tenderId: number;
    customerId: number;
  }): Promise<void> {
    await this.issueSession(match.tenderId, match.customerId);
    await this.rotateAccessCodeForTender(match.tenderId);
  }

  static async setActiveTender(
    customerId: number,
    tenderId: number,
  ): Promise<void> {
    const tender = await TenderRepository.findOneBy({ id: tenderId });
    if (!tender || tender.customerId !== customerId) {
      throw new Error("Solicitud no encontrada.");
    }
    await setCustomerTenderSession(tenderId, customerId);
  }

  static async assertSession(): Promise<{
    tenderId: number;
    customerId: number;
  }> {
    const session = await getCustomerTenderSession();
    if (!session) {
      throw new Error("Sesión de cliente no válida o expirada.");
    }
    const tender = await TenderRepository.findOneBy({ id: session.tenderId });
    if (!tender || tender.customerId !== session.customerId) {
      throw new Error("Sesión de cliente no válida o expirada.");
    }
    return {
      tenderId: session.tenderId,
      customerId: session.customerId,
    };
  }

  static async logout(): Promise<void> {
    await clearCustomerTenderSession();
  }
}
