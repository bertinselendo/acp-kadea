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

export const getUserProjects = async (req: Request, res: Response) => {
  const userID = req.params.id;
  const user = res.locals.session?.user;

  if (!userID) {
    return BadRequestError(res, "Bad Request: missing user id");
  }

  try {
    if (user.role == "ADMIN" || user.role == "MANAGER") {
      const projects = await prisma.project.findMany({
        include: {
          client: true,
        },
      });
      res.status(201).json(projects);
    } else if (user.role == "WORKER") {
      const projects = await prisma.teamMember
        .findFirst({
          where: {
            user: {
              id: userID,
            },
          },
          include: {
            projects: {
              include: {
                client: true,
              },
            },
          },
        })
        .then((result) => result?.projects);
      res.status(201).json(projects);
    } else if (user.role == "CLIENT") {
      const projects = await prisma.client
        .findFirst({
          where: {
            users: {
              some: {
                id: userID,
              },
            },
          },
          include: {
            projects: {
              include: {
                client: true,
              },
            },
          },
        })
        .then((result) => result?.projects);
      res.status(201).json(projects);
    }
  } catch (error) {
    res.status(500).json({ error: "Error getting user projects" });
  }
};
