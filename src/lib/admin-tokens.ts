import crypto from "crypto";

const EXPIRY_MS = 72 * 60 * 60 * 1000; // 72 jam

export type AdminAction = "confirm" | "reject";

export interface TokenPayload {
  orderId: string;
  action: AdminAction;
  issuedAt: number;
}

const getSecret = () => {
  const secret = process.env.ADMIN_ACTION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_ACTION_SECRET env var belum diset (minimal 16 karakter)",
    );
  }
  return secret;
};

export const signToken = (orderId: string, action: AdminAction): string => {
  const payload = `${orderId}.${action}.${Date.now()}`;
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  const payloadB64 = Buffer.from(payload).toString("base64url");
  return `${payloadB64}.${signature}`;
};

export const verifyToken = (token: string): TokenPayload | null => {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString();
  } catch {
    return null;
  }

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature, "base64url");
  const expBuf = Buffer.from(expected, "base64url");
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  const segments = payload.split(".");
  if (segments.length !== 3) return null;
  const [orderId, action, issuedAtStr] = segments;
  if (action !== "confirm" && action !== "reject") return null;

  const issuedAt = parseInt(issuedAtStr, 10);
  if (isNaN(issuedAt)) return null;
  if (Date.now() - issuedAt > EXPIRY_MS) return null;

  return { orderId, action: action as AdminAction, issuedAt };
};
