/**
 * lib/auth.ts
 *
 * Admin authentication using JOSE JWT + HTTP-only cookies.
 *
 * SECURITY NOTES:
 *   - Token is stored in an HTTP-only, Secure, SameSite=Lax cookie.
 *     JavaScript cannot read it → XSS cannot steal the session.
 *   - Admin password is compared with constant-time comparison to
 *     prevent timing attacks.
 *   - Set ADMIN_JWT_SECRET to a random 32+ character string in .env.local.
 *   - Set ADMIN_PASSWORD to a strong password in .env.local.
 *   - Both values are server-only (no NEXT_PUBLIC_ prefix).
 *
 * SETUP:
 *   ADMIN_PASSWORD=your-strong-password-here
 *   ADMIN_JWT_SECRET=at-least-32-random-characters-here
 */

import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";
const EXPIRY_HOURS = 8;

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "[auth] ADMIN_JWT_SECRET must be set to a string of 32+ characters in .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

/** Sign a new admin JWT. */
export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_HOURS}h`)
    .sign(getSecret());
}

/** Verify an admin JWT. Returns true if valid and not expired. */
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/**
 * Constant-time string comparison.
 * Prevents timing attacks when comparing passwords.
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Cookie options for the admin session token. */
export const SESSION_COOKIE = {
  name:     COOKIE_NAME,
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path:     "/",
  maxAge:   EXPIRY_HOURS * 60 * 60,
};
