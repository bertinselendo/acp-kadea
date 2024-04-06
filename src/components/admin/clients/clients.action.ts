"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

export async function getClients() {
  // const user = await auth();

  // if (!user) {
  //   return;
  // }

  try {
    const client = await prisma.client.findMany({
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
  // const user = await auth();

  // if (!user) {
  //   return;
  // }

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
