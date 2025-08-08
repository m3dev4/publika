import { PrismaClient } from "@/lib/prisma-client-js";
import { createPost } from "@/server/action/post/createPost";
import { CreatePostInput } from "@/types/post.type";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log("=== DEBUT CREATION POST ===");
    console.log(
      "Headers reçus:",
      Object.fromEntries(request.headers.entries()),
    );

    const body = await request.formData();
    const title = body.get("title") as string;
    const content = body.get("content") as string;
    const type = body.get("type") as "GENERAL" | "MISSION";
    const categoryId = body.get("categoryId") as string;
    const photo = body.get("photo") as string;
    const status =
      (body.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT";
    const prices = body.get("prices") as string;

    console.log("Données du post:", { title, content, type, status });

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, type" },
        { status: 400 },
      );
    }

    let userId: string | null = null;

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (session?.user?.id) {
        userId = session.user.id;
        console.log("Session trouvée:", session.user.email);
      } else {
        console.log("Aucune session Better Auth");
      }
    } catch (authError) {
      console.log("Erreur Better Auth:", authError);
    }

    // Si pas de session Better Auth, utiliser le cookie auth-storage
    if (!userId) {
      const cookieHeader = request.headers.get("cookie");
      console.log("Recherche dans les cookies...");

      if (cookieHeader) {
        // D'abord essayer Better Auth
        const sessionMatch = cookieHeader.match(
          /better-auth\.session_token=([^;]+)/,
        );
        if (sessionMatch) {
          const token = decodeURIComponent(sessionMatch[1]);
          const dbSession = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
          });

          if (dbSession?.user && dbSession.expiresAt > new Date()) {
            userId = dbSession.user.id;
            console.log("Session DB trouvée:", dbSession.user.email);
          }
        }

        // Si pas de Better Auth, utiliser auth-storage
        if (!userId) {
          const authStorageMatch = cookieHeader.match(/auth-storage=([^;]+)/);
          if (authStorageMatch) {
            try {
              const authData = JSON.parse(
                decodeURIComponent(authStorageMatch[1]),
              );
              if (
                authData?.state?.user?.id &&
                authData?.state?.isAuthenticated
              ) {
                userId = authData.state.user.id;
                console.log(
                  "Utilisateur trouvé dans auth-storage:",
                  authData.state.user.email,
                );

                // Vérifier que l'utilisateur existe toujours en DB
                const user = await prisma.user.findUnique({
                  where: { id: userId as string },
                });

                if (!user) {
                  console.log("Utilisateur n'existe plus en DB");
                  userId = null;
                }
              }
            } catch (error) {
              console.log("Erreur parsing auth-storage:", error);
            }
          }
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const photoArray = photo ? JSON.parse(photo) : [];
    const priceNumber = prices ? parseFloat(prices) : null;

    const postData: CreatePostInput = {
      title,
      content,
      type: type as "GENERAL" | "MISSION",
      categoryId: categoryId || null,
      photo: photoArray,
      status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
      prices: priceNumber,
    };

    console.log("Creating post with data:", postData);
    console.log("User ID:", userId);

    const post = await createPost(postData, userId);

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
