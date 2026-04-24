type LogLevel = "info" | "warn" | "error";

type LogMeta = Record<string, unknown> | undefined;

const sanitizeError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return error;
  }

  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  };
};

const writeLog = (level: LogLevel, message: string, meta?: LogMeta) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };

  const serialized = JSON.stringify(payload);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
};

export const logger = {
  info: (message: string, meta?: LogMeta) => {
    writeLog("info", message, meta);
  },
  warn: (message: string, meta?: LogMeta) => {
    writeLog("warn", message, meta);
  },
  error: (message: string, error?: unknown, meta?: LogMeta) => {
    writeLog("error", message, {
      ...(meta || {}),
      error: sanitizeError(error),
    });
  },
};
