import express, { NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";

export const deleteProject = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  try {
    const deleteFeedbacks = prisma.feedback.deleteMany({
      where: {
        projectId: projectId,
      },
    });

    const deleteDocuments = prisma.document.deleteMany({
      where: {
        projectId: projectId,
      },
    });

    const deleteInvoices = prisma.invoice.deleteMany({
      where: {
        projectId: projectId,
      },
    });

    const deleteCredentials = prisma.credential.deleteMany({
      where: {
        projectId: projectId,
      },
    });

    const deleteProject = prisma.client.delete({
      where: {
        id: projectId,
      },
    });

    const transaction = await prisma.$transaction([
      deleteFeedbacks,
      deleteDocuments,
      deleteInvoices,
      deleteCredentials,
      deleteProject,
    ]);

    if (transaction) res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Error getting client" });
  }
};
