import { cookies, headers } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "./db";
import { signSessionToken, verifySessionToken } from "./auth";

const COOKIE = "m90_session";
const MAX_AGE_DAYS = 30;

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

// Crea una sesión revocable (fila Session) y setea la cookie JWT httpOnly.
export async function createSession(userId: string): Promise<void> {
  const tokenId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + MAX_AGE_DAYS * 864e5);
  await prisma.session.create({
    data: {
      userId,
      tokenId,
      expiresAt,
      userAgent: headers().get("user-agent") ?? undefined,
    },
  });
  const token = await signSessionToken({ sub: userId, jti: tokenId });
  cookies().set(COOKIE, token, cookieOptions(expiresAt));
}

// Cierra la sesión actual (borra la fila y la cookie).
export async function destroySession(): Promise<void> {
  const token = cookies().get(COOKIE)?.value;
  if (token) {
    const claims = await verifySessionToken(token);
    if (claims) {
      await prisma.session.deleteMany({ where: { tokenId: claims.jti } });
    }
  }
  cookies().delete(COOKIE);
}

// Devuelve el usuario autenticado o null. Valida firma + sesión no revocada/expirada.
export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;

  const claims = await verifySessionToken(token);
  if (!claims) return null;

  const session = await prisma.session.findUnique({ where: { tokenId: claims.jti } });
  if (!session || session.expiresAt < new Date()) return null;

  return prisma.user.findUnique({ where: { id: claims.sub } });
}

// Igual que getCurrentUser pero lanza 401 (para usar en route handlers protegidos).
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("No autorizado");
    this.name = "UnauthorizedError";
  }
}
