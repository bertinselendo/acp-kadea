import express, { NextFunction, type Request, type Response } from "express";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string, status = 404) {
    super(status, message);
    this.name = "NotFoundError";
  }
}

export const BadRequestError = (res: Response, message: string) => {
  res.status(400).json({ error: "Bad Request" });
};
