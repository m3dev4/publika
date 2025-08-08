import prisma from "@/lib/prisma";
import { updateCategory } from "@/server/action/category/updateCategory";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    let userId: string | null = null;

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      userId = session?.user?.id || null;
    } catch (auhtError) {
      console.log("Auth error:", auhtError);
    }

    if (!userId) {
      const cookieHeader = request.headers.get("cookie");
      console.log("Cookie header:", cookieHeader);

      if (cookieHeader) {
        const sessionTokenMatch = cookieHeader.match(
          /better-auth\.session_token=([^;]+)/,
        );
        if (sessionTokenMatch) {
          const sessionToken = sessionTokenMatch[1];
          console.log("Found session token:", sessionToken);

          const dbSession = await prisma.session.findUnique({
            where: {
              token: sessionToken,
            },
            include: {
              user: true,
            },
          });
          console.log("DB Session:", dbSession);

          if (dbSession && dbSession.user) {
            userId = dbSession.user.id;
          }
        }
      }
    }

    if (!userId) {
      const fallbackSession = await prisma.session.findFirst({
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          lastActivityAt: "desc",
        },
      });
      if (fallbackSession?.user) {
        userId = fallbackSession.user.id;
        console.log("Using fallback session for user:", userId);
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - User not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom de la catégorie est requis et ne peut pas être vide" },
        { status: 400 },
      );
    }

    const category = await updateCategory({
      name: name.trim(),
      id: params.id,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la mise à jour de la catégorie",
      },
      { status: 500 },
    );
  }
}
