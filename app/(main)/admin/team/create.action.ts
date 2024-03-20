"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

type newUserActionType = {
  contactFistName: string;
  contactEmail: string;
  role: string;
};

type newMemberActionType = {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatar: string;
  type: string;
  companyName: string;
  phone: string;
};

export async function teamCreationAction(values: newMemberActionType) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const newUserMember = await prisma.user.create({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        avatar: values.avatar,
      },
    });

    if (newUserMember) {
      const newTeamMember = await prisma.teamMember.create({
        data: {
          userId: newUserMember.id,
          type: values.type,
          companyName: values.companyName,
          phone: values.phone,
        },
      });

      return newUserMember;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}
