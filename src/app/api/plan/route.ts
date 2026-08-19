import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { PROTO_LABEL } from "@/lib/fasting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  const plan = await prisma.dietPlan.findFirst({ where: { userId: user.id }, orderBy: { week: "desc" } });
  if (!plan) return NextResponse.json({ empty: true });

  return NextResponse.json({
    plan: {
      week: plan.week,
      dietType: plan.dietType,
      protocol: PROTO_LABEL[plan.fastingProtocol],
      kcal: plan.kcalTarget,
      carbsG: plan.carbsG,
      proteinG: plan.proteinG,
      fatG: plan.fatG,
      waterTargetL: plan.waterTargetL,
    },
  });
}
