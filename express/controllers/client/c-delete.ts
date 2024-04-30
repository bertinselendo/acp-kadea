import express, { NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const deleteClient = async (req: Request, res: Response) => {
  const clientID = req.params.id;

  if (!clientID) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const deleteUsers = prisma.user.deleteMany({
      where: {
        clientId: clientID,
      },
    });

    const deleteProjects = prisma.project.deleteMany({
      where: {
        clientID: clientID,
      },
    });

    const deleteClient = prisma.client.delete({
      where: {
        id: clientID,
      },
    });

    const transaction = await prisma.$transaction([
      deleteUsers,
      deleteProjects,
      deleteClient,
    ]);

    if (transaction) res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error getting client" });
  }
};
