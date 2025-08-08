import { NextRequest } from "next/server";
import { auth } from "@/utils/auth";
import { PrismaClient } from "@/lib/prisma-client-js";
import { log } from "@/lib/secure-logger";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
    isVerify: boolean;
    onboarding: boolean;
  };
}

export async function requireAuth(
  request: NextRequest,
): Promise<{ user: any; error?: string }> {
  try {
    log.debug("API authentication attempt");

    // Method 1: Try Better Auth first
    let userId: string | null = null;

    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      userId = session?.user?.id || null;
      if (userId) {
        log.debug("Better Auth session found");
      }
    } catch (authError) {
      log.debug("Better Auth method failed");
    }

    // Method 2: If Better Auth fails, try to get session from cookies manually
    if (!userId) {
      const cookieHeader = request.headers.get("cookie");

      if (cookieHeader) {
        // Extract session token from cookies
        const sessionTokenMatch = cookieHeader.match(
          /better-auth\.session_token=([^;]+)/,
        );
        if (sessionTokenMatch) {
          const sessionToken = sessionTokenMatch[1];

          // Find session in database using the token
          const dbSession = await prisma.session.findUnique({
            where: {
              token: sessionToken,
            },
            include: {
              user: true,
            },
          });

          if (dbSession && dbSession.user) {
            userId = dbSession.user.id;
            log.debug("Database session found");
          }
        }
      }
    }

    // Method 3: Try auth-storage cookie (Zustand)
    if (!userId) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const authStorageMatch = cookieHeader.match(/auth-storage=([^;]+)/);
        if (authStorageMatch) {
          try {
            const decodedValue = decodeURIComponent(authStorageMatch[1]);
            const authData = JSON.parse(decodedValue);
            if (authData.state?.user?.id) {
              userId = authData.state.user.id;
              log.debug("Zustand auth-storage found");
            }
          } catch (parseError) {
            log.debug("Failed to parse auth-storage cookie");
          }
        }
      }
    }

    if (!userId) {
      log.auth(false);
      return { user: null, error: "Non authentifié" };
    }

    // Récupérer les détails complets de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isVerify: true,
        onboarding: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      log.auth(false, userId);
      return { user: null, error: "Utilisateur introuvable" };
    }

    log.auth(true, userId);
    return { user };
  } catch (error) {
    log.error("API authentication error", error);
    return { user: null, error: "Erreur d'authentification" };
  }
}

export async function requireAdmin(
  request: NextRequest,
): Promise<{ user: any; error?: string }> {
  const { user, error } = await requireAuth(request);

  if (error || !user) {
    return { user: null, error: error || "Non authentifié" };
  }

  if (user.role !== "ADMIN") {
    return { user: null, error: "Permissions administrateur requises" };
  }

  return { user };
}

export async function requireEmailVerified(
  request: NextRequest,
): Promise<{ user: any; error?: string }> {
  const { user, error } = await requireAuth(request);

  if (error || !user) {
    return { user: null, error: error || "Non authentifié" };
  }

  if (!user.isVerify) {
    return { user: null, error: "Email non vérifié" };
  }

  return { user };
}

export async function requireOnboarding(
  request: NextRequest,
): Promise<{ user: any; error?: string }> {
  const { user, error } = await requireEmailVerified(request);

  if (error || !user) {
    return { user: null, error: error || "Email non vérifié" };
  }

  if (!user.onboarding) {
    return { user: null, error: "Onboarding non terminé" };
  }

  return { user };
}
