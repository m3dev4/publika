import { NextRequest } from "next/server";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Store en mémoire (pour production, utiliser Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit(config: RateLimitConfig) {
  return async (
    request: NextRequest,
  ): Promise<{ success: boolean; error?: string; remaining?: number }> => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const key = `rate_limit:${ip}`;
    const now = Date.now();

    // Nettoyer les entrées expirées
    cleanupExpiredEntries();

    const entry = rateLimitStore.get(key);

    if (!entry) {
      // Première requête
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { success: true, remaining: config.maxRequests - 1 };
    }

    if (now > entry.resetTime) {
      // Fenêtre expirée, reset
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { success: true, remaining: config.maxRequests - 1 };
    }

    if (entry.count >= config.maxRequests) {
      // Limite atteinte
      return {
        success: false,
        error: config.message || "Trop de requêtes. Réessayez plus tard.",
        remaining: 0,
      };
    }

    // Incrémenter le compteur
    entry.count++;
    rateLimitStore.set(key, entry);

    return { success: true, remaining: config.maxRequests - entry.count };
  };
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Configurations prédéfinies
export const authRateLimit = rateLimit({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
});

export const apiRateLimit = rateLimit({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Trop de requêtes API. Réessayez plus tard.",
});

export const strictRateLimit = rateLimit({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
  message: "Limite de requêtes atteinte. Réessayez dans 1 minute.",
});
