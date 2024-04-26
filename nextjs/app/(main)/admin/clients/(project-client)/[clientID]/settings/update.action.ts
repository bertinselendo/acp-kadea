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

export async function clientUpdateAction(
  values: newClientActionType,
  clientID: string
) {
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

  const id = clientID;

  try {
    const updatedClient = await prisma.client.update({
      where: {
        id: id,
      },
      data: data,
    });
    return updatedClient;
  } catch (error) {
    console.log(error);
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
