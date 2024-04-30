import express, { type Request, type Response } from "express";
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../../errors";
import { TeamMember, User } from "@prisma/client";

export const updateProject = async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const values = req.body?.values;
  const sMembers = req.body?.sMembers;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  if (!values) {
    return BadRequestError(res, "Bad Request: Missing values");
  }

  if (!sMembers) {
    return BadRequestError(res, "Bad Request: Missing member");
  }

  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        title: values.title,
        description: values.description,
        cover: values.cover,
        priority: values.priority,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
        tags: values.tags,
      },
    });

    if (updatedProject) {
      for (const sMember of sMembers) {
        await prisma.teamMember.update({
          where: { id: sMember.teamMembers.id },
          data: {
            projects: {
              connect: {
                id: updatedProject.id,
              },
            },
          },
        });
      }

      res.status(201).json(updatedProject);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating project" });
  }
};

export const removeTeamMember = async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const sMember: User & { teamMembers: TeamMember } = req.body?.sMember;

  if (!projectId) {
    return BadRequestError(res, "Bad Request: Missing project id");
  }

  if (!sMember) {
    return BadRequestError(res, "Bad Request: Missing member");
  }

  try {
    const member = await prisma.teamMember.update({
      where: { id: sMember.teamMembers.id },
      data: {
        projects: {
          disconnect: {
            id: projectId,
          },
        },
      },
    });

    if (member) {
      res.status(201).json(member);
    }
  } catch (error) {
    res.status(500).json({ error: "Error While disconect teamMember" });
  }
};
