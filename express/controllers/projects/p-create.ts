import express, { NextFunction, type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";
import { Credential, Document, Feedback, Invoice, User } from "@prisma/client";

export const createFeedback = async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const values: Feedback = req.body?.values;
  const user: User = res.locals.session?.user;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  if (!values) {
    return BadRequestError(res, "Bad Request: Missing values");
  }

  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        createdBy: user.id,
        title: values.title,
        link: values.link,
        note: values.note,
        projectId: projectId,
      },
      include: {
        project: true,
      },
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const values: Document = req.body?.values;
  const user: User = res.locals.session?.user;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  if (!values) {
    return BadRequestError(res, "Bad Request: Missing values");
  }

  try {
    const newDocument = await prisma.document.create({
      data: {
        createdBy: user.id,
        type: values.type,
        title: values.title,
        content: values.content,
        link: values?.link,
        projectId: projectId,
      },
      include: {
        project: true,
      },
    });
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const values: Invoice = req.body?.values;
  const user: User = res.locals.session?.user;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  if (!values) {
    return BadRequestError(res, "Bad Request: Missing values");
  }

  try {
    const newInvoice = await prisma.invoice.create({
      data: {
        createdBy: user.id,
        reference: values.reference,
        dueDate: values.dueDate,
        file: values.file,
        link: values.link,
        projectId: projectId,
      },
      include: {
        project: true,
      },
    });
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};

export const createCredential = async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const values: Credential = req.body?.values;
  const user: User = res.locals.session?.user;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  if (!values) {
    return BadRequestError(res, "Bad Request: Missing values");
  }

  try {
    const newCredential = await prisma.credential.create({
      data: {
        createdBy: user.id,
        service: values.service,
        username: values.username,
        password: values.password,
        adminUrl: values.adminUrl,
        projectId: projectId,
      },
    });
    res.status(201).json(newCredential);
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};
