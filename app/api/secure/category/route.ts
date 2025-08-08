import { createCategory } from "@/server/action/category/createCategory";
import { NextRequest, NextResponse } from "next/server";
import { requireOnboarding } from "@/lib/api-auth";
import { apiRateLimit } from "@/lib/rate-limit";
import { validateRequest, secureTextSchema } from "@/lib/security-validation";
import { logAudit } from "@/lib/audit-logger";
import { log } from "@/lib/secure-logger";
import { z } from "zod";
import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

// Schema de validation pour la création de catégorie
const createCategorySchema = z.object({
  name: secureTextSchema
    .min(1, "Nom de catégorie requis")
    .max(100, "Nom trop long"),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // 1. Rate limiting
    const rateLimitResult = await apiRateLimit(request);
    if (!rateLimitResult.success) {
      await logAudit({
        action: "RATE_LIMIT_EXCEEDED",
        success: false,
        details: { endpoint: "/api/secure/category" },
        ipAddress: ip,
        userAgent,
        errorMessage: rateLimitResult.error,
      });

      return NextResponse.json(
        { error: rateLimitResult.error },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining":
              rateLimitResult.remaining?.toString() || "0",
          },
        },
      );
    }

    // 2. Authentification et autorisation
    const authResult = await requireOnboarding(request);
    if (authResult.error || !authResult.user) {
      await logAudit({
        action: "SECURITY_VIOLATION",
        success: false,
        details: { endpoint: "/api/secure/category", reason: "unauthorized" },
        ipAddress: ip,
        userAgent,
        errorMessage: authResult.error,
      });

      return NextResponse.json(
        { error: authResult.error || "Non autorisé" },
        { status: 401 },
      );
    }

    // 3. Validation des données
    const body = await request.json();
    const validation = validateRequest(createCategorySchema)(body);

    if (!validation.success) {
      await logAudit({
        userId: authResult.user.id,
        action: "CATEGORY_CREATE",
        success: false,
        details: { validationError: validation.error },
        ipAddress: ip,
        userAgent,
        errorMessage: validation.error,
      });

      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 4. Création de la catégorie
    const category = await prisma.category.create({
      data: {
        name: validation.data.name,
        userId: authResult.user.id,
      },
    });

    // 5. Log d'audit de succès
    await logAudit({
      userId: authResult.user.id,
      action: "CATEGORY_CREATE",
      success: true,
      details: {
        categoryId: category.id,
        categoryName: category.name,
        responseTime: Date.now() - startTime,
      },
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    log.error("Category creation failed", error);

    await logAudit({
      action: "CATEGORY_CREATE",
      success: false,
      details: { endpoint: "/api/secure/category" },
      ipAddress: ip,
      userAgent,
      errorMessage: error instanceof Error ? error.message : "Erreur inconnue",
    });

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: 429 },
      );
    }

    // Authentification
    const authResult = await requireOnboarding(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "Non autorisé" },
        { status: 401 },
      );
    }

    // Récupération des catégories de l'utilisateur
    const categories = await prisma.category.findMany({
      where: { userId: authResult.user.id },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    log.error("Category fetch failed", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
