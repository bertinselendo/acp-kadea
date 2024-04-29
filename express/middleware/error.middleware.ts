import type { NextFunction, Request, Response } from "express";
import { HttpError, NotFoundError } from "../errors.js";

export const errorHandler = (
  err: HttpError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // send the error
  res.status(("status" in err && err.status) || 500);
  res.send({
    title: "status" in err ? err.status : err.name,
    message: err.message,
  });
};

export const errorNotFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new NotFoundError("Not Found"));
};
