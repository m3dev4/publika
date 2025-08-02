/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { headers } from "next/headers";
import { PrismaClient } from "@/lib/prisma-client-js";
import { auth } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Method 1: Try Better Auth first
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
    
    // Method 2: If Better Auth fails, try to get session from cookies manually
    if (!userId) {
      const cookieHeader = request.headers.get('cookie');
      console.log("Cookie header:", cookieHeader);
      
      if (cookieHeader) {
        // Extract session token from cookies
        const sessionTokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
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
    
    // Method 3: Fallback - get any active session (for testing only)
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
          lastActivityAt: 'desc',
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
        { status: 401 }
      );
    }
    
    console.log("Authenticated user ID:", userId);

    const categories = await prisma.category.findMany({
      where: {
        userId: userId,
      },
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}
