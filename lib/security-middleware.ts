import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "./audit-logger";

// Headers de sécurité
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Protection XSS
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // HSTS (HTTPS uniquement)
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  // CSP basique
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
  );

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

// Détection d'attaques basiques
export async function detectSuspiciousActivity(request: NextRequest): Promise<boolean> {
  const url = request.url;
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Patterns suspects
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /<script/i, // XSS
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
    /vbscript:/i, // VBScript injection
    /onload=/i, // Event handler injection
    /onerror=/i, // Event handler injection
  ];

  // Vérifier l'URL
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      await logAudit({
        action: "SECURITY_VIOLATION",
        success: false,
        details: {
          type: "suspicious_url",
          url,
          pattern: pattern.toString(),
        },
        ipAddress: ip,
        userAgent,
      });
      return true;
    }
  }

  // User agents suspects
  const suspiciousUserAgents = [/sqlmap/i, /nikto/i, /nessus/i, /burp/i, /nmap/i];

  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      await logAudit({
        action: "SECURITY_VIOLATION",
        success: false,
        details: {
          type: "suspicious_user_agent",
          userAgent,
        },
        ipAddress: ip,
        userAgent,
      });
      return true;
    }
  }

  return false;
}

// Validation des headers
export function validateHeaders(request: NextRequest): { valid: boolean; error?: string } {
  const contentType = request.headers.get("content-type");
  const method = request.method;

  // Pour les requêtes POST/PUT, vérifier le Content-Type
  if (["POST", "PUT", "PATCH"].includes(method)) {
    if (!contentType || !contentType.includes("application/json")) {
      return {
        valid: false,
        error: "Content-Type application/json requis",
      };
    }
  }

  // Vérifier la taille des headers
  const headerSize = Array.from(request.headers.entries()).reduce(
    (size, [key, value]) => size + key.length + value.length,
    0
  );

  if (headerSize > 8192) {
    // 8KB max
    return {
      valid: false,
      error: "Headers trop volumineux",
    };
  }

  return { valid: true };
}

// Middleware de sécurité complet
export async function securityMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Détecter les activités suspectes
  const isSuspicious = await detectSuspiciousActivity(request);
  if (isSuspicious) {
    return NextResponse.json({ error: "Activité suspecte détectée" }, { status: 403 });
  }

  // Valider les headers
  const headerValidation = validateHeaders(request);
  if (!headerValidation.valid) {
    return NextResponse.json({ error: headerValidation.error }, { status: 400 });
  }

  return null; // Continuer le traitement
}
