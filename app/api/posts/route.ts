import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostType, PostStatus } from "@/lib/prisma-client-js";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Récupération des paramètres de filtrage
    const typeParam = searchParams.get("type");
    const categoryId = searchParams.get("categoryId");
    const regionId = searchParams.get("regionId");
    const cityId = searchParams.get("cityId");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Construction des filtres
    const where: any = {
      status: PostStatus.PUBLISHED, // Seulement les posts publiés
    };

    // Filtrer par type seulement si ce n'est pas 'ALL' et que c'est un type valide
    if (
      typeParam &&
      typeParam !== "ALL" &&
      (typeParam === "GENERAL" || typeParam === "MISSION")
    ) {
      where.type = typeParam as PostType;
    }

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (cityId && cityId !== "all") {
      where.cityId = cityId;
    } else if (regionId && regionId !== "all") {
      // Si pas de ville spécifique mais région sélectionnée
      where.city = {
        regionId: regionId,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calcul de l'offset pour la pagination
    const skip = (page - 1) * limit;

    // Récupération des posts avec relations
    const posts = await prisma.posts.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
            isTalent: true,
            isAnnouncer: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        city: {
          select: {
            id: true,
            name: true,
            region: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Comptage total pour la pagination
    const total = await prisma.posts.count({ where });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des posts" },
      { status: 500 },
    );
  }
}
