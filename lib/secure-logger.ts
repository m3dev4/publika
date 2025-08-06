// Système de logging sécurisé qui ne expose pas de données sensibles

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogOptions {
  level: LogLevel;
  context?: string;
  userId?: string;
  action?: string;
}

class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isDebugEnabled = process.env.DEBUG_LOGS === "true";

  // Données sensibles à masquer
  private sensitiveFields = [
    "password",
    "token",
    "sessionToken",
    "email",
    "cookie",
    "authorization",
    "secret",
    "key",
    "id",
  ];

  // Masquer les données sensibles
  private sanitizeData(data: any): any {
    if (!data) return data;

    if (typeof data === "string") {
      // Masquer les tokens, emails, etc.
      if (data.includes("@")) return this.maskEmail(data);
      if (data.length > 20) return data.substring(0, 8) + "***";
      return data;
    }

    if (typeof data === "object") {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = this.sensitiveFields.some((field) => lowerKey.includes(field));

        if (isSensitive) {
          sanitized[key] = this.maskSensitiveValue(value);
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!domain) return "***";
    return `${local.substring(0, 2)}***@${domain}`;
  }

  private maskSensitiveValue(value: any): string {
    if (!value) return "[empty]";
    if (typeof value === "string") {
      if (value.length <= 4) return "***";
      return `${value.substring(0, 2)}***${value.substring(value.length - 2)}`;
    }
    return "[masked]";
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === "error") return true;
    if (level === "warn") return true;
    if (level === "info" && this.isDevelopment) return true;
    if (level === "debug" && this.isDebugEnabled) return true;
    return false;
  }

  private formatMessage(message: string, options: LogOptions, data?: any): string {
    const timestamp = new Date().toISOString();
    const context = options.context ? `[${options.context}]` : "";
    const userId = options.userId ? `[User:${this.maskSensitiveValue(options.userId)}]` : "";
    const action = options.action ? `[${options.action}]` : "";

    let logMessage = `${timestamp} ${options.level.toUpperCase()} ${context}${userId}${action} ${message}`;

    if (data && this.shouldLog(options.level)) {
      const sanitizedData = this.sanitizeData(data);
      logMessage += ` ${JSON.stringify(sanitizedData)}`;
    }

    return logMessage;
  }

  debug(message: string, data?: any, options: Partial<LogOptions> = {}) {
    if (this.shouldLog("debug")) {
      console.log(this.formatMessage(message, { level: "debug", ...options }, data));
    }
  }

  info(message: string, data?: any, options: Partial<LogOptions> = {}) {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage(message, { level: "info", ...options }, data));
    }
  }

  warn(message: string, data?: any, options: Partial<LogOptions> = {}) {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage(message, { level: "warn", ...options }, data));
    }
  }

  error(message: string, error?: any, options: Partial<LogOptions> = {}) {
    if (this.shouldLog("error")) {
      const errorData =
        error instanceof Error
          ? {
              message: error.message,
              stack: this.isDevelopment ? error.stack : "[hidden]",
            }
          : error;

      console.error(this.formatMessage(message, { level: "error", ...options }, errorData));
    }
  }

  // Méthodes spécialisées pour l'audit
  authAttempt(success: boolean, userId?: string, context?: string) {
    this.info(`Auth attempt ${success ? "SUCCESS" : "FAILED"}`, null, {
      context: context || "AUTH",
      userId,
      action: "LOGIN_ATTEMPT",
    });
  }

  apiAccess(endpoint: string, userId?: string, success: boolean = true) {
    this.info(
      `API access ${success ? "SUCCESS" : "FAILED"}`,
      { endpoint },
      {
        context: "API",
        userId,
        action: "API_ACCESS",
      }
    );
  }

  securityViolation(type: string, details?: any, userId?: string) {
    this.warn(`Security violation: ${type}`, details, {
      context: "SECURITY",
      userId,
      action: "VIOLATION",
    });
  }
}

// Instance singleton
export const secureLogger = new SecureLogger();

// Helpers pour remplacer les console.log existants
export const log = {
  debug: (msg: string, data?: any) => secureLogger.debug(msg, data),
  info: (msg: string, data?: any) => secureLogger.info(msg, data),
  warn: (msg: string, data?: any) => secureLogger.warn(msg, data),
  error: (msg: string, error?: any) => secureLogger.error(msg, error),
  auth: (success: boolean, userId?: string) => secureLogger.authAttempt(success, userId),
  api: (endpoint: string, userId?: string, success?: boolean) =>
    secureLogger.apiAccess(endpoint, userId, success),
  security: (type: string, details?: any, userId?: string) =>
    secureLogger.securityViolation(type, details, userId),
};
