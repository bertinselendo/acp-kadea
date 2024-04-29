import express, { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const deleteUser = async (req: Request, res: Response) => {
  const userID = req.params.id;

  if (!userID) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error getting client" });
  }
};
