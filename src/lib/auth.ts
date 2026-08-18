import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// Hash de contraseña (bcrypt, sin dependencias nativas).
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// --- JWT de sesión (HS256, jose) ---------------------------------------------

function secretKey(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET no está configurado");
  return new TextEncoder().encode(s);
}

export interface SessionClaims {
  sub: string; // userId
  jti: string; // Session.tokenId (revocable)
}

export async function signSessionToken(claims: SessionClaims): Promise<string> {
  return new SignJWT({ jti: claims.jti })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || !payload.jti) return null;
    return { sub: String(payload.sub), jti: String(payload.jti) };
  } catch {
    return null;
  }
}

// Genera un código OTP de 6 dígitos (para WhatsApp).
export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
