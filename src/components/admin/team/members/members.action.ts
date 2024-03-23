"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

type updateMemberActionType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatar: string;
  type: string;
  companyName: string;
  phone: string;
  teamMembers: [
    {
      id: string;
    }
  ];
};

export async function getTeamMembers() {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const members = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "MANAGER", "WORKER"],
        },
      },
      include: {
        teamMembers: true, // Inclure les posts associés
      },
    });

    return members;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function teamUpdateAction(
  values: updateMemberActionType,
  userID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  if (user.role != "ADMIN") {
    return;
  }

  try {
    const userUpdate = await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
      },
      include: {
        teamMembers: true,
      },
    });

    if (userUpdate) {
      const teamUpdate = await prisma.teamMember.update({
        where: {
          id: userUpdate.teamMembers?.id,
        },
        data: {
          type: values.type,
          companyName: values.companyName,
          phone: values.phone,
        },
      });

      return userUpdate;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function teamDeleteAction(userID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  if (user.role != "ADMIN") {
    return;
  }

  try {
    const userDelete = await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    return userDelete;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}
