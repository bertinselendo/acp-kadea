import express, { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const getUserByEmail = async (req: Request, res: Response) => {
  const userEmail = req.params.email;

  if (!userEmail) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail, // Inclure les posts associés
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error getting client" });
  }
};

export const getUserClient = async (req: Request, res: Response) => {
  const userID = req.params.id;

  if (!userID) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const client = await prisma.client.findFirst({
      where: {
        users: {
          some: {
            id: userID,
          },
        },
      },
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: "Error getting client" });
  }
};
