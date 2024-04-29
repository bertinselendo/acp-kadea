import express, { NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const getClientData = async (req: Request, res: Response) => {
  const clientID = req.params.id;

  if (!clientID) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: clientID,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: "Error getting client" });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const clientID = req.params.id;

  if (!clientID) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        clientID: clientID,
      },
      include: {
        teamMembers: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error getting projects" });
  }
};
