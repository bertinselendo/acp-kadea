"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type updateEditFormProps = {
  userEmail: string;
  values: any;
};

export const updateEditForm = async (props: updateEditFormProps) => {
  try {
    const res = await prisma.user.update({
      where: {
        email: props.userEmail,
      },
      data: {
        name: props.values.name,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (userEmail: string) => {
  try {
    const res = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
  return;
};
