import type { User } from "@prisma/client";

// Campos seguros del usuario para enviar al cliente (sin passwordHash).
export function publicUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    whatsapp: u.whatsapp,
    locale: u.locale,
    plan: u.plan,
    missionStartDate: u.missionStartDate,
    level: u.level,
    points: u.points,
    createdAt: u.createdAt,
  };
}

export type PublicUser = ReturnType<typeof publicUser>;
