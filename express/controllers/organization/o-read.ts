import express, { NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const getOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const organizationId = req.params.id;

  if (!organizationId) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      include: {
        clients: true,
      },
    });

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: "Error getting clients" });
  }
};

export const getTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const organizationId = req.params.id;

  if (!organizationId) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const members = await prisma.user.findMany({
      where: {
        organizationId: organizationId,
        role: {
          in: ["ADMIN", "MANAGER", "WORKER"],
        },
      },
      include: {
        teamMembers: true, // Inclure les posts associés
      },
    });

    res.status(201).json(members);
  } catch (error) {
    res.status(500).json({ error: "Error getting clients" });
  }
};

export const getClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const organizationId = req.params.id;

  if (!organizationId) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const clients = await prisma.client.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        users: true,
      },
    });

    res.status(201).json(clients);
  } catch (error) {
    res.status(500).json({ error: "Error getting clients" });
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const organizationId = req.params.id;

  if (!organizationId) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        client: {
          organizationId: organizationId,
        },
      },
    });

    res.status(201).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error getting clients" });
  }
};

export const getAllOrgStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const organizationId = req.params.id;

  if (!organizationId) {
    return BadRequestError(res, "Bad Request");
  }

  try {
    const order = {
      user: {
        organizationId: organizationId,
      },
    };

    const feedbacks = await prisma.feedback.count({
      where: order,
    });

    const documents = await prisma.document.count({
      where: order,
    });
    const credentials = await prisma.credential.count({
      where: order,
    });
    const invoices = await prisma.invoice.count({
      where: order,
    });

    const stats = {
      feedbacks: feedbacks,
      documents: documents,
      credentials: credentials,
      invoices: invoices,
    };

    res.status(201).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error getting clients" });
  }
};
