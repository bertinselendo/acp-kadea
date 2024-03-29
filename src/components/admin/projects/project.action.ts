"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

export async function getClientProjects(clientID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        clientID: clientID,
      },
      include: {
        teamMembers: true,
      },
    });

    return projects;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getClientSingleProject(projectID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectID,
      },
      include: {
        teamMembers: true,
      },
    });

    return project;
  } catch (error) {
    throw new Error("Error databse");
  }
}

type newProjectActionType = {
  title: string;
  description: string;
  cover: string;
  priority: string;
  startDate: Date;
  endDate: Date;
  status: string;
  tags: string;
  clientID: string;
};

export async function projectCreationAction(
  values: newProjectActionType,
  clientID: string,
  sMembers: any
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        title: values.title,
        description: values.description,
        cover: values.cover,
        priority: values.priority,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
        tags: values.tags,
        clientID: clientID,
      },
    });

    if (newProject) {
      for (const sMember of sMembers) {
        await prisma.teamMember.update({
          where: { id: sMember.teamMembers.id },
          data: {
            projects: {
              connect: {
                id: newProject.id,
              },
            },
          },
        });
      }

      return newProject;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function projectUpdateAction(
  values: newProjectActionType,
  projectId: string,
  sMembers: any
) {
  const user = await auth();

  if (!user) {
    return;
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

      return updatedProject;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function projectRemoveTeamMemberAction(
  projectId: string,
  sMember: any
) {
  const user = await auth();

  if (!user) {
    return;
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
      return member;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error While disconect teamMember Entries");
  }
}
