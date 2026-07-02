import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const components = await prisma.component.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
      },
    });
    return NextResponse.json(components);
  } catch (error) {
    console.error("Components API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}
