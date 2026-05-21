import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "customer_tender_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24;
const PAYLOAD_TYP = "customer_tender";

export type CustomerTenderSessionPayload = {
  typ: typeof PAYLOAD_TYP;
  tenderId: number;
  customerId: number;
  exp: number;
};

function getSecret(): string {
  const secret =
    process.env.CUSTOMER_TENDER_SESSION_SECRET ??
    (process.env.NODE_ENV === "development" && process.env.AUTH_SECRET
      ? `customer-tender:${process.env.AUTH_SECRET}`
      : undefined);
  if (!secret || secret.length < 16) {
    throw new Error(
      "CUSTOMER_TENDER_SESSION_SECRET must be set (min 16 characters).",
    );
  }
  return secret;
}

function signPayload(payload: CustomerTenderSessionPayload): string {
  const secret = getSecret();
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token: string): CustomerTenderSessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const secret = getSecret();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as CustomerTenderSessionPayload;
    if (parsed.typ !== PAYLOAD_TYP) return null;
    if (!Number.isFinite(parsed.tenderId) || parsed.tenderId <= 0) return null;
    if (!Number.isFinite(parsed.customerId) || parsed.customerId <= 0) {
      return null;
    }
    if (!Number.isFinite(parsed.exp) || parsed.exp < Date.now() / 1000) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function setCustomerTenderSession(
  tenderId: number,
  customerId: number,
): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const token = signPayload({
    typ: PAYLOAD_TYP,
    tenderId,
    customerId,
    exp,
  });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export async function getCustomerTenderSession(): Promise<CustomerTenderSessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearCustomerTenderSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
