"use server";

import type {
  CustomerTenderAccessResultDTO,
  CustomerTenderOptionDTO,
  CustomerTenderOverviewDTO,
} from "@/src/lib/dtos/CustomerTenderPortal.dto";
import { CustomerTenderAccessService } from "@/src/lib/services/customer-tender-access.service";
import { CustomerTenderPortalService } from "@/src/lib/services/customer-tender-portal.service";
import { getTenderNumber } from "@/src/lib/utils/tender.utils";
import type { ActionResponse } from "@/src/lib/utils/action-response";
import { getErrorMessage } from "@/src/lib/utils/error";

const verifyAttempts = new Map<string, { count: number; resetAt: number }>();
const requestAttempts = new Map<string, { count: number; resetAt: number }>();
const VERIFY_LIMIT = 5;
const REQUEST_LIMIT = 3;
const VERIFY_WINDOW_MS = 15 * 60 * 1000;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkRequestRateLimit(email: string): boolean {
  const key = `request:${email.trim().toLowerCase()}`;
  const now = Date.now();
  const entry = requestAttempts.get(key);
  if (!entry || entry.resetAt < now) {
    requestAttempts.set(key, { count: 1, resetAt: now + VERIFY_WINDOW_MS });
    return true;
  }
  if (entry.count >= REQUEST_LIMIT) {
    return false;
  }
  entry.count += 1;
  return true;
}

function checkVerifyRateLimit(email: string): boolean {
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const entry = verifyAttempts.get(key);
  if (!entry || entry.resetAt < now) {
    verifyAttempts.set(key, { count: 1, resetAt: now + VERIFY_WINDOW_MS });
    return true;
  }
  if (entry.count >= VERIFY_LIMIT) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function _requestCustomerTenderAccessCode(
  email: string,
): Promise<ActionResponse<void>> {
  const normalizedEmail = String(email ?? "").trim();

  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    return { success: false, error: "Ingresa un correo electrónico válido." };
  }

  if (!checkRequestRateLimit(normalizedEmail)) {
    return {
      success: false,
      error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
    };
  }

  try {
    await CustomerTenderAccessService.requestAccessCode(normalizedEmail);
    return { success: true };
  } catch (error) {
    console.error("Error requesting customer tender access code:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _verifyCustomerTenderAccess(
  email: string,
  code: string,
): Promise<ActionResponse<CustomerTenderAccessResultDTO>> {
  const normalizedEmail = String(email ?? "").trim();
  const normalizedCode = String(code ?? "").trim();

  if (!normalizedEmail || normalizedCode.length !== 6) {
    return { success: false, error: "Correo o código incorrectos." };
  }

  if (!checkVerifyRateLimit(normalizedEmail)) {
    return {
      success: false,
      error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
    };
  }

  try {
    const match = await CustomerTenderAccessService.verifyAccess(
      normalizedEmail,
      normalizedCode,
    );
    if (!match) {
      return { success: false, error: "Correo o código incorrectos." };
    }

    await CustomerTenderAccessService.completeLogin(match);

    return {
      success: true,
      data: { requestNumber: getTenderNumber(match.tenderId) },
    };
  } catch (error) {
    console.error("Error verifying customer tender access:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _getCustomerTenderOverview(): Promise<
  ActionResponse<CustomerTenderOverviewDTO>
> {
  try {
    const { tenderId, customerId } =
      await CustomerTenderAccessService.assertSession();
    const data = await CustomerTenderPortalService.getOverview(
      tenderId,
      customerId,
    );
    return { success: true, data };
  } catch (error) {
    console.error("Error loading customer tender overview:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _listCustomerTenderOptions(): Promise<
  ActionResponse<CustomerTenderOptionDTO[]>
> {
  try {
    const { customerId } = await CustomerTenderAccessService.assertSession();
    const data =
      await CustomerTenderPortalService.listTenderOptions(customerId);
    return { success: true, data };
  } catch (error) {
    console.error("Error listing customer tenders:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _setCustomerActiveTender(
  tenderId: number,
): Promise<ActionResponse<CustomerTenderOverviewDTO>> {
  if (!Number.isFinite(tenderId) || tenderId <= 0) {
    return { success: false, error: "Solicitud inválida." };
  }
  try {
    const { customerId } = await CustomerTenderAccessService.assertSession();
    await CustomerTenderAccessService.setActiveTender(customerId, tenderId);
    const data = await CustomerTenderPortalService.getOverview(
      tenderId,
      customerId,
    );
    return { success: true, data };
  } catch (error) {
    console.error("Error setting active customer tender:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function _logoutCustomerTenderAccess(): Promise<
  ActionResponse<void>
> {
  try {
    await CustomerTenderAccessService.logout();
    return { success: true };
  } catch (error) {
    console.error("Error logging out customer tender session:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}
