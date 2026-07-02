import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const upgrade = await prisma.upgrade.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            color: true,
            nationality: true,
          },
        },
        component: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
          },
        },
        grandPrix: {
          select: {
            id: true,
            name: true,
            round: true,
            circuit: true,
            country: true,
            date: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            url: true,
            caption: true,
            source: true,
          },
        },
        models3d: {
          select: {
            id: true,
            label: true,
            fileUrl: true,
            format: true,
            sourceTool: true,
          },
        },
      },
    });

    if (!upgrade) {
      return NextResponse.json({ error: "Upgrade not found" }, { status: 404 });
    }

    // Expose the `models3d` relation as `models` for the frontend contract.
    const { models3d, ...rest } = upgrade;
    return NextResponse.json({ ...rest, models: models3d });
  } catch (error) {
    console.error("Upgrade detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch upgrade" },
      { status: 500 }
    );
  }
}
