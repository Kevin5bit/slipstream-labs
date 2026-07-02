import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || "2026";
    const seasonInt = parseInt(season, 10);

    const grandPrix = await prisma.grandPrix.findMany({
      where: { season: seasonInt },
      orderBy: { round: "asc" },
      select: {
        id: true,
        name: true,
        round: true,
        circuit: true,
        country: true,
        date: true,
      },
    });
    return NextResponse.json(grandPrix);
  } catch (error) {
    console.error("Grand Prix API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch grand prix" },
      { status: 500 }
    );
  }
}
