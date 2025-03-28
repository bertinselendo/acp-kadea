"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

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

// CREATE

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

// READ

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
        teamMembers: {
          include: {
            user: true,
          },
        },
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

export async function getProjectAllUsers(projectID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const teamUsers = await prisma.teamMember
      .findMany({
        where: {
          projects: {
            some: {
              id: projectID,
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
          id: projectID,
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

    return allUsers;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getProjectClient(clientID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: clientID,
      },
      include: {
        users: true,
      },
    });

    return client;
  } catch (error) {
    throw new Error("Error getting client");
  }
}

export async function getProjectTeamMembers(clientID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const team = await prisma.teamMember
      .findMany({
        where: {
          projects: {
            some: {
              clientID: clientID,
            },
          },
        },
        include: {
          user: true,
        },
      })
      .then((result) => result.map((teamMember) => teamMember.user));

    return team;
  } catch (error) {
    throw new Error("Error getting team");
  }
}

export async function getCurrentUserProjects() {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    if (user.role == "ADMIN" || user.role == "MANAGER") {
      const projects = await prisma.project.findMany({
        include: {
          client: true,
        },
      });
      return projects;
    } else if (user.role == "WORKER") {
      const projects = await prisma.teamMember
        .findFirst({
          where: {
            user: {
              id: user.id,
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
        .then((result) => result.projects);
      return projects;
    } else if (user.role == "CLIENT") {
      const projects = await prisma.client
        .findFirst({
          where: {
            users: {
              some: {
                id: user.id,
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
        .then((result) => result.projects);
      return projects;
    }
  } catch (error) {
    throw new Error("Error getting projects");
  }
}

// UPDATE

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

// DELETE

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
