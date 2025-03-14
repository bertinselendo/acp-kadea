"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

// CREATE

export async function createClientUser(values: User, clientID: string) {
  const user = await auth();

  if (!user) return;

  if (!user.organizationId) return;

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (findUser) {
      if (findUser.role == "GUEST") {
        const user = await prisma.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            role: "CLIENT",
            clientId: clientID,
          },
          include: {
            client: true,
          },
        });
        return user;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: "CLIENT",
        clientId: clientID,
        organizationId: user.organizationId,
      },
      include: {
        client: true,
      },
    });
    return newUser;
  } catch (error) {
    if (error.meta?.target[0] == "email") {
      throw new Error("User already exist");
    } else {
      throw new Error("Error in database");
    }
  }
}

// READ

export async function getClients() {
  const user = await auth();

  if (!user) return;

  if (!user.organizationId) return;

  try {
    const client = await prisma.client.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        users: true, // Inclure les posts associés
      },
    });

    return client;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getSingleClient(clientID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const client = await prisma.client.findFirst({
      where: {
        id: clientID,
      },
      include: {
        users: true, // Inclure les posts associés
      },
    });

    return client;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getClientByUser(userID: string) {
  const user = await auth();

  if (!user) {
    return;
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
    return client;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getClientUsers(clientID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const users = await prisma.client
      .findUnique({
        where: {
          id: clientID,
        },
        include: {
          users: true,
        },
      })
      .then((result) => result?.users);

    return users;
  } catch (error) {
    throw new Error("Error getting client users");
  }
}

export async function getUser(userEmail: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail, // Inclure les posts associés
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error getting user");
  }
}

// DELETE

export async function deleteClientUser(userID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    return user;
  } catch (error) {
    throw new Error("Error while deleting");
  }
}

export async function deleteClient(clientID: string) {
  const user = await auth();

  if (!user) {
    return;
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

    if (transaction) return transaction;
  } catch (error) {
    throw new Error("Error while deleting");
  }
}
