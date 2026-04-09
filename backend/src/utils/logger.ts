type LogLevel = "info" | "warn" | "error";

const formatMessage = (level: LogLevel, message: string) => {
  const now = new Date().toISOString();
  return `[${now}] [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  info: (message: string) => {
    console.info(formatMessage("info", message));
  },
  warn: (message: string) => {
    console.warn(formatMessage("warn", message));
  },
  error: (message: string, error?: unknown) => {
    console.error(formatMessage("error", message), error);
  },
};
