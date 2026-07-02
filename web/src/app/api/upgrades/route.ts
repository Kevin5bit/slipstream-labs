import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const componentId = searchParams.get("componentId");
    const season = searchParams.get("season");

    const where: Prisma.UpgradeWhereInput = {};
    if (teamId) where.teamId = teamId;
    if (componentId) where.componentId = componentId;
    if (season) {
      const seasonInt = parseInt(season, 10);
      where.grandPrix = {
        season: seasonInt,
      };
    }

    const upgrades = await prisma.upgrade.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        team: true,
        component: true,
        grandPrix: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    return NextResponse.json(upgrades);
  } catch (error) {
    console.error("Upgrades API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch upgrades" },
      { status: 500 }
    );
  }
}
