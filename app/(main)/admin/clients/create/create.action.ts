"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

type newUserActionType = {
  contactFistName: string;
  contactEmail: string;
  role: string;
};

type newClientActionType = {
  userId: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAdress: string;
  companyCountry: string;
  companyLogo: string;
  companyCategorie: string;
  companySize: string;
  companyWebsite: string;
  internalNote: string;
};

export async function userCreationAction(
  values: newUserActionType,
  clientID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  values.role = "CLIENT";

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: values.contactEmail,
      },
    });

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          firstName: values.contactFistName,
          email: values.contactEmail,
          role: values.role as Role,
          clientId: clientID,
        },
      });

      return newUser;
    }

    return user;
  } catch (error) {
    console.log("Error Databse");
    return;
  }
}

export async function clientCreationAction(values: newClientActionType) {
  const user = await auth();

  if (!user) {
    return;
  }

  const data = {
    companyName: values.companyName,
    companyEmail: values.companyEmail,
    phone: values.companyPhone,
    address: values.companyAdress,
    country: values.companyCountry,
    logo: values.companyLogo,
    categorie: values.companyCategorie,
    size: values.companySize,
    website: values.companyWebsite,
    internalNote: values.internalNote,
  };

  try {
    const newClient = await prisma.client.create({
      data: data,
    });
    return newClient;
  } catch (error) {
    console.log(error);
    throw new Error("Error databse");
  }
}

export async function isClientData(values: any) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const client = await prisma.client.findUnique({
      where: {
        companyEmail: values.companyEmail,
      },
    });
    if (!client) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getClientData(clientId: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const user = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });
    return user;
  } catch (error) {
    throw new Error("Error databse");
  }
}
