import { PrismaClient } from "@/lib/prisma-client-js";

const prisma = new PrismaClient();

export type AuditAction =
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "USER_REGISTER"
  | "USER_EMAIL_VERIFY"
  | "USER_PASSWORD_RESET"
  | "USER_PROFILE_UPDATE"
  | "USER_ROLE_CHANGE"
  | "ADMIN_ACCESS"
  | "CATEGORY_CREATE"
  | "CATEGORY_UPDATE"
  | "CATEGORY_DELETE"
  | "SECURITY_VIOLATION"
  | "RATE_LIMIT_EXCEEDED";

export interface AuditLogData {
  userId?: string;
  action: AuditAction;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export async function logAudit(data: AuditLogData): Promise<void> {
  try {
    // Pour l'instant, log en console (en production, utiliser une base de données dédiée)
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId: data.userId || "anonymous",
      action: data.action,
      success: data.success,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      errorMessage: data.errorMessage,
    };

    console.log("🔍 AUDIT LOG:", JSON.stringify(logEntry, null, 2));

    // TODO: En production, sauvegarder dans une table d'audit dédiée
    // await prisma.auditLog.create({ data: logEntry });
  } catch (error) {
    console.error("❌ Erreur lors du logging d'audit:", error);
  }
}

// Helpers pour les actions courantes
export const auditHelpers = {
  userLogin: (userId: string, ipAddress?: string, userAgent?: string) =>
    logAudit({
      userId,
      action: "USER_LOGIN",
      success: true,
      ipAddress,
      userAgent,
    }),

  userLoginFailed: (email: string, ipAddress?: string, userAgent?: string, error?: string) =>
    logAudit({
      action: "USER_LOGIN",
      success: false,
      details: { email },
      ipAddress,
      userAgent,
      errorMessage: error,
    }),

  adminAccess: (userId: string, path: string, ipAddress?: string) =>
    logAudit({
      userId,
      action: "ADMIN_ACCESS",
      success: true,
      details: { path },
      ipAddress,
    }),

  securityViolation: (details: Record<string, any>, ipAddress?: string) =>
    logAudit({
      action: "SECURITY_VIOLATION",
      success: false,
      details,
      ipAddress,
    }),

  rateLimitExceeded: (ipAddress?: string, endpoint?: string) =>
    logAudit({
      action: "RATE_LIMIT_EXCEEDED",
      success: false,
      details: { endpoint },
      ipAddress,
    }),
};
