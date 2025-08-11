import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get("regionId");

    const where: any = {};
    if (regionId && regionId !== "all") {
      where.regionId = regionId;
    }

    const cities = await prisma.city.findMany({
      where,
      select: {
        id: true,
        name: true,
        regionId: true,
        region: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            posts: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ cities });
  } catch (error) {
    console.error("Erreur lors de la récupération des villes:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des villes" },
      { status: 500 },
    );
  }
}
