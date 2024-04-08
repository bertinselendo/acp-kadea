"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { Credential } from "@prisma/client";

export async function credentialsCreationAction(
  values: Credential,
  projectID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const newCredential = await prisma.credential.create({
      data: {
        createdBy: user.id,
        service: values.service,
        username: values.username,
        password: values.password,
        adminUrl: values.adminUrl,
        projectId: projectID,
      },
    });
    return newCredential;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function getProjectCredentials(projectID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const credentials = await prisma.credential.findMany({
      where: {
        projectId: projectID,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return credentials;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function credentialUpdatetAction(
  values: Credential,
  credentialID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const credential = await prisma.credential.update({
      where: {
        id: credentialID,
      },
      data: {
        service: values.service,
        username: values.username,
        password: values.password,
        adminUrl: values.adminUrl,
      },
    });
    return credential;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function credentialDeleteAction(credentialID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const credential = await prisma.credential.delete({
      where: {
        id: credentialID,
      },
    });
    return credential;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}
