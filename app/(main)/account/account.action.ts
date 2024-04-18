"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

type newUserUpdateActionType = {
  avatar: string;
  firstName: string;
  lastName: string;
};

export async function accountUpdateAction(values: newUserUpdateActionType) {
  const user = await auth();

  if (!user) {
    return;
  }

  const data = values.avatar
    ? {
        avatar: values.avatar,
        firstName: values.firstName,
        lastName: values.lastName,
      }
    : {
        firstName: values.firstName,
        lastName: values.lastName,
      };

  try {
    const updateRes = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: data,
    });
    return updateRes;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function accountData(email: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function getUserAllDatas(userID: string) {
  try {
    const user = prisma.user.findUnique({
      where: {
        id: userID,
      },
      include: {
        feedbacks: true,
        documents: true,
        credentials: true,
        invoices: true,
      },
    });

    return user;
  } catch (error) {
    throw error("Error getting all datas");
  }
}
