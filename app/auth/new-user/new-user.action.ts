"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

type newUserUpdateActionType = {
  avatar: string;
  firstName: string;
  lastName: string;
};

export async function newUserUpdateAction(values: newUserUpdateActionType) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const updateRes = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: values.avatar,
        firstName: values.firstName,
        lastName: values.lastName,
      },
    });
    return updateRes;
  } catch (error) {
    throw new Error("Error databse");
  }
}
