import express, { NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const getProject = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        teamMembers: true,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Error getting project" });
  }
};

export const getProjectAllUsers = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  try {
    const teamUsers = await prisma.teamMember
      .findMany({
        where: {
          projects: {
            some: {
              id: projectId,
            },
          },
        },
        include: {
          user: true,
        },
      })
      .then((result) => result.map((teamMember) => teamMember.user));

    const clientUsers = await prisma.project
      .findUnique({
        where: {
          id: projectId,
        },
        include: {
          client: {
            include: {
              users: true,
            },
          },
        },
      })
      .then((result) => result?.client.users);

    const allUsers =
      clientUsers == null ? teamUsers : teamUsers.concat(clientUsers);

    res.status(201).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Error getting project users" });
  }
};

export const getProjectFeedbacks = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Error getting project feedback" });
  }
};

export const getProjectDocuments = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  try {
    const feedbacks = await prisma.document.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Error getting project feedback" });
  }
};

export const getProjectInvoices = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  try {
    const feedbacks = await prisma.invoice.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Error getting project feedback" });
  }
};

export const getProjectCredentials = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  try {
    const feedbacks = await prisma.credential.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Error getting project feedback" });
  }
};
