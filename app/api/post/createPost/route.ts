import { PrismaClient } from "@/lib/prisma-client-js";
import { createPost } from "@/server/action/post/createPost";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const title = body.get("title") as string;
    const content = body.get("content") as string;
    const type = body.get("type") as "GENERAL" | "MISSION";
    const categoryId = body.get("categoryId") as string;
    const photo = body.get("photo") as string;
    const status =
      (body.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT";
    const prices = body.get("prices") as string;

    if (!title || !content || !categoryId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let userId: string | null = null;

    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      userId = session?.user?.id || null;
      console.log("Better Auth session:", session);
    } catch (authError) {
      console.log("Better Auth failed:", authError);
    }

    if (!userId) {
      const cookieHeader = request.headers.get("cookie");
      console.log("Cookie header:", cookieHeader);

      if (cookieHeader) {
        // Extract session token from cookies
        const sessionTokenMatch = cookieHeader.match(
          /better-auth\.session_token=([^;]+)/,
        );
        if (sessionTokenMatch) {
          const sessionToken = sessionTokenMatch[1];
          console.log("Found session token:", sessionToken);

          // Find session in database using the token
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
      console.log("Trying fallback method...");
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

    const photoArray = photo ? JSON.parse(photo) : undefined;
    const priceNumber = prices ? parseFloat(prices) : undefined;

    const postData = {
      id: "",
      userId,
      title,
      content,
      type: type,
      categoryId,
      photo: photoArray || undefined,
      status: status,
      prices: priceNumber || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const post = await createPost(postData, userId);

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
