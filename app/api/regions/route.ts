import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      select: {
        id: true,
        name: true,
        cities: {
          select: {
            id: true,
            name: true,
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
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ regions });
  } catch (error) {
    console.error("Erreur lors de la récupération des régions:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des régions" },
      { status: 500 },
    );
  }
}
