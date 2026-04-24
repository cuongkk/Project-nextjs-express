import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

const REQUEST_ID_HEADER = "x-request-id";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const incomingRequestId = `${req.headers[REQUEST_ID_HEADER] || ""}`.trim();
  const requestId = incomingRequestId || randomUUID();

  req.headers[REQUEST_ID_HEADER] = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);
  res.locals.requestId = requestId;

  next();
};
